import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Unit } from '../units/models';
import { MatDialog } from '@angular/material/dialog';
import { ChooseUnitDialog } from '../dialogs/choose-unit-dialog/choose-unit-dialog.component';
import { SeaBattleService } from '../../services/sea-battle.service';
import { ActivatedRoute } from '@angular/router';
import { UniteTypes } from '../constants';
import { MessageBoxDialog } from '../../helpers/message-box/message-box.component';
import { Socket } from 'ngx-socket-io';

@Component({
    selector: 'sea-battle',
    templateUrl: './sea-battle.template.html',
    styleUrls: ['./sea-battle.styles.scss'],
})

export class SeaBattleComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() isEditMode: boolean = false;
    @Input() backgroundImage: string = '';
    @Input() battleField: Array<Array<Unit>> = new Array<Array<Unit>>();
    @Output() onFieldChanged: EventEmitter<void> = new EventEmitter<void>();

    public battleRows: number = 7;
    public battleCols: number = 7;
    public coords: string = '';

    public battleHeader: string[] = [' '];

    private arrEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    private arrRu = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э'];
    private headerChars: string[];

    private donatpaySocket !: WebSocketSubject<any>;
    private uid: number = 0;
    private widgetCode: string = '';
    private donationAlertsInterval: any;
    private delayDamage: number = 3000;

    private currencies: Map<string, number> = new Map<string, number>();

    constructor(
        private readonly httpClient: HttpClient,
        private route: ActivatedRoute,
        private seaBattleService: SeaBattleService,
        private socket: Socket,
        private readonly dialog: MatDialog) {
        this.headerChars = this.arrRu;
        this.widgetCode = this.route.snapshot.queryParams.widgetCode;

        for(let i = 0; i < this.battleCols; i++) {
            this.battleHeader.push(this.headerChars[i]);
        }

        this.currencies.set('RUB', 1);
        this.currencies.set('EUR', 86);
        this.currencies.set('USD', 72);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.battleField && !changes.battleField.firstChange) {
            const field = changes.battleField.currentValue ? changes.battleField.currentValue as Array<Array<Unit>> : [[]];

            this.battleCols = field[0].length;
            const newbattleHeader = [''];

            for(let i = 0; i < this.battleCols; i++) {
                newbattleHeader.push(this.headerChars[i]);
            }

            this.battleHeader = newbattleHeader;
        }
    }

    ngOnDestroy(): void {
        clearInterval(this.donationAlertsInterval);
    }

    ngAfterViewInit(): void {
        if (this.isEditMode) {

        } else {
            this.loadSettings();
        }
    }

    onClickCell(cell: Unit) {
        if (cell.health > 0) {
            cell.health = -1;
        }
    }

    onDamage(coords: string, userName: string, damageValue: number) {
        const value = coords.toUpperCase();

        let char = 'а';
        let digit = 1;

        const firstCheck = value.match(/([A-ZА-Я]+)([0-9]+)/);
        if (firstCheck) {
            char = firstCheck[1];
            digit = +firstCheck[2];
        } else {
            const secondCheck = value.match(/([0-9]+)([A-ZА-Я]+)/);
            if(secondCheck) {
                char = secondCheck[2];
                digit = +secondCheck[1];
            }
        }

        const colIndex = this.headerChars.indexOf(char);
        const rowIndex = digit - 1;

        if (this.battleRows > rowIndex && this.battleCols > colIndex) {
            const cell = this.battleField[rowIndex][colIndex];
            if (cell.health > 0) {
                if (cell.type === UniteTypes.Text) {
                    cell.value = (cell.value as string).replace('(username)', userName);
                }
                cell.health = cell.health - damageValue;
            }
        }
    }

    openChooseUnitDialog(unit: Unit) {
        const dialogRef = this.dialog.open(ChooseUnitDialog, {
            width: '510px',
            data: {
                unit: { ...unit },
            },
        });

        dialogRef.afterClosed().subscribe((result: Unit) => {
            if (result) {
                unit.health = result.health;
                unit.type = result.type;
                unit.value = result.value;

                if (this.onFieldChanged) {
                    this.onFieldChanged.next();
                }
            }
        });
    }

    private connectToDonatePayEvents(widgetUrl: string) {
        const splitedUrl = widgetUrl.split('/');
        const widgetToken = splitedUrl[splitedUrl.length - 1];

        this.httpClient.post<DonatePaySocketTokens>('/api/donatepay/GetTokens', { widgetToken })
        .subscribe((response) => {
            console.log(response);

            this.soketConnect(response);

        }, (error) => {
            console.log(error);
        });
    }

    private soketConnect(tokens: DonatePaySocketTokens ) {
        this.donatpaySocket = webSocket({url: 'wss://centrifugo.donatepay.ru:43002/connection/websocket', 
        openObserver: {
            next: () => {
                const msg = {
                method: 'connect',
                params: {
                    user: tokens.userId,
                    info: '',
                    timestamp: tokens.time.toString(),
                    token: tokens.token
                },
                uid: (++this.uid).toString()
                };

                this.donatpaySocket.next(msg);
            },
            },
        });

        this.donatpaySocket.subscribe((data) => {
            if (data.method === 'connect') {
                const msg = {
                    method: 'subscribe',
                    params: { channel: `notifications#${tokens.userId}` },
                    uid: (++this.uid).toString()
                };

                this.donatpaySocket.next(msg);


                // const msg2 = {
                //     method: 'subscribe',
                //     params: { channel: `widgets:LastEvents#${tokens.userId}` },
                //     uid: (++this.uid).toString()
                // };

                // this.donatpaySocket.next(msg2);

            } else if (data.method === 'message') {
                setTimeout(() => { // подождать чтобы сначала открылся виджет оповещения 
                const object = JSON.parse(data.body.data.notification.vars);
                this.parceAndExecudeDonate(new Donate(0, object.name, object.comment, Number.parseFloat(object.sum)));
                }, this.delayDamage);
            }
        }, (error) => {
            console.log(error);
        });
    }

    private parceAndExecudeDonate(data: Donate) {
        try {
            const userName: string = data.name;
            let comment: string = data.comment;
            if (comment) {
                comment = comment.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

                const coordsMatch = comment.match(/[<({\"«'](.+?)['»\"})>]/);
                let coords = '';
    
                if (coordsMatch) {
                    coords = coordsMatch[1].replace(' ', '');
    
                    this.onDamage(coords, userName, data.sum);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private loadSettings() {
        this.seaBattleService.getSettings(this.widgetCode).subscribe((data) => {
            this.battleField = data.fieldData;
            this.battleCols = data.columns;
            this.battleRows = data.rows;
            this.backgroundImage = data.backgroundImage;

            this.battleHeader = [''];
            for(let i = 0; i < data.columns; i++) {
                this.battleHeader.push(this.headerChars[i]);
            }

            if (data.donatePayWidgetUrl && data.donatePayWidgetUrl.length > 1) {
                this.connectToDonatePayEvents(data.donatePayWidgetUrl);
            }

            if (data.donationAlertsWidgetUrl && data.donationAlertsWidgetUrl.length > 1) {
                this.connectToDonationAlertsEvents(data.donationAlertsWidgetUrl);
            }

        }, (error) => {
            const ref = this.dialog.open(MessageBoxDialog, {
                width: '600px',
                data: {
                    header: 'Ошибка',
                    message: 'Не удалось загрузить настройки. Перезагрузите страницу.',
                    withButtons: true,
                },
            });
            console.log(error);
        });
    }

    private connectToDonationAlertsEvents(widgetUrl: string) {
        const parameters = new URLSearchParams(widgetUrl);
        const token = parameters.get('token');
        
        this.socket.emit('add-user', { token: token, type: 'alert_widget' });
        this.socket.fromEvent('donation').subscribe((data: any) => {
            setTimeout(() => { // подождать чтобы сначала открылся виджет оповещения 
                const msg = JSON.parse(data);
                const currency = this.getCurrencyValue(msg.currency);
                const donate = new Donate(msg.id, msg.username, msg.message, Number.parseFloat(msg.amount) * currency);
                this.parceAndExecudeDonate(donate);
            }, this.delayDamage);
        }, (error) => {
            console.log(error);
        });
    }

    getCurrencyValue(cur: string) {
        const currency = cur.toUpperCase();
        let result = this.currencies.get(currency);

        if (!result) {
            result = 1;
        }

        return result;
    }
}

class DonatePaySocketTokens {
    public time: number = 0;
    public token: string = '';
    public userId: string = '';
}

class Donate {
    public id: number;
    public name: string;
    public comment: string;
    public sum: number;

    constructor(id: number,name: string, comment: string, sum: number) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.sum = sum;
    }
}
