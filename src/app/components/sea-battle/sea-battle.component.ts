import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Component({
    selector: 'sea-battle',
    templateUrl: './sea-battle.template.html',
    styleUrls: ['./sea-battle.styles.scss'],
})

export class SeaBattleComponent implements AfterViewInit {
    public battleField: Array<Array<Cell>> = new Array<Array<Cell>>();

    public battleRows: number = 10;
    public battleCols: number = 10;

    public battleHeader: string[] = [' '];
    public damage: number = 13;

    private arrEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    private arrRu = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э'];

    private donatpaySocket: WebSocketSubject<any> = webSocket('');
    private uid: number = 0;

    constructor(private httpClient: HttpClient) {
        for(let i = 0; i < this.battleCols; i++) {
            this.battleHeader.push(this.arrEn[i]);
        }

        let count = 1;
        for(let i = 0; i < this.battleRows; i++) {
            this.battleField[i] = [];

            for(let j = 0; j < this.battleCols; j++) {
                this.battleField[i][j] = new Cell(count, 50);
                count++;
            }
        }

        // TODO вызывать только если заранее известен адрес, например, из localstorage
        this.getSoketTokensFromWidget("https://widget.donatepay.ru/alert-box/widget/baac68e8774a666758dec941315467fb8a3152d8fb46a909e5a6ab981889dfb9")
    }

    ngAfterViewInit(): void {}

    onClickCell(cell: Cell) {
        if (cell.health > 0) {
            cell.health = cell.health - this.damage;
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
                console.log('message: ' + JSON.stringify(data));
            }
        }, (error) => {
            console.log(error);
        })
     }
}


class Cell {
    public value: number;
    public health: number;

    constructor(value: number, health: number) {
        this.value = value;
        this.health = health;
    }
}

class DonatePaySocketTokens {
    public time: number = 0;
    public token: string = '';
    public userId: string = '';
}
