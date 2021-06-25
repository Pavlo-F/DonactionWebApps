import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Unit } from '../units/models';
import { UniteTypes } from '../constants';

@Component({
    selector: 'sea-battle',
    templateUrl: './sea-battle.template.html',
    styleUrls: ['./sea-battle.styles.scss'],
})

export class SeaBattleComponent implements AfterViewInit {
    public battleField: Array<Array<Unit>> = new Array<Array<Unit>>();

    public battleRows: number = 7;
    public battleCols: number = 7;
    public coords: string = '';

    public battleHeader: string[] = [' '];
    public damage: number = 100;

    private arrEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    private arrRu = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э'];
    private headerChars: string[];

    private donatpaySocket: WebSocketSubject<any> = webSocket('');
    private uid: number = 0;

    constructor(private httpClient: HttpClient) {
        this.headerChars = this.arrRu;

        for(let i = 0; i < this.battleCols; i++) {
            this.battleHeader.push(this.headerChars[i]);
        }

        let count = 1;
        for(let i = 0; i < this.battleRows; i++) {
            this.battleField[i] = [];

            for(let j = 0; j < this.battleCols; j++) {
                const rand = Math.random();
                const unit = new Unit('', 50, 30);

                if (rand > 0.5 && rand <= 0.8) {
                    unit.type = UniteTypes.ReduceTime;
                } else if (rand > 0.8) {
                    unit.type = UniteTypes.IncreaseTime;
                }

                this.battleField[i][j] = unit;
                count++;
            }
        }

        // TODO вызывать только если заранее известен адрес, например, из localstorage
        this.getSoketTokensFromWidget("https://widget.donatepay.ru/alert-box/widget/baac68e8774a666758dec941315467fb8a3152d8fb46a909e5a6ab981889dfb9")
    }

    ngAfterViewInit(): void {}

    onClickCell(cell: Unit) {
        if (cell.health > 0) {
            cell.health = cell.health - this.damage;
        }
    }

    onDamage(coords: string) {
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
                cell.health = cell.health - this.damage;
            }
        }
    }

    private getSoketTokensFromWidget(widgetUrl: string) {

        const splitedUrl = widgetUrl.split('/');
        const widgetToken = splitedUrl[splitedUrl.length - 1];

        this.httpClient.post<DonatePaySocketTokens>(`${environment.apiUrl}/api/donatepay/GetTokens`, { widgetToken })
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
                //console.log('message: ' + JSON.stringify(data));
                this.parceAndExecudeDonate(data);
            }
        }, (error) => {
            console.log(error);
        })
    }

    private parceAndExecudeDonate(data: any) {
        try {
            const object = JSON.parse(data.body.data.notification.vars);
            const userName = object.name;
            let comment: string = object.comment;
            if (comment) {
                comment = comment.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

                const coordsMatch = comment.match(/[<({\"](.+?)[\"})>]/);
                let coords = '';
    
                if (coordsMatch) {
                    coords = coordsMatch[1].replace(' ', '');
    
                    this.onDamage(coords);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

class DonatePaySocketTokens {
    public time: number = 0;
    public token: string = '';
    public userId: string = '';
}
