import { AfterViewInit, Component } from '@angular/core';

@Component({
    selector: 'sea-battle',
    templateUrl: './sea-battle.template.html',
    styleUrls: ['./sea-battle.styles.scss'],
})

export class SeaBattleComponent implements AfterViewInit {
    public battleField: Array<Array<number>> = new Array<Array<number>>();

    public battleRows: number = 10;
    public battleCols: number = 10;

    public battleHeader: string[] = [' '];

    private arrEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    private arrRu = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э', 'Ю'];

    constructor() {
        for(let i = 0; i < this.battleCols; i++) {
            this.battleHeader.push(this.arrEn[i]);
        }

        let count = 1;
        for(let i = 0; i < this.battleRows; i++) {
            this.battleField[i] = [];

            for(let j = 0; j < this.battleCols; j++) {
                this.battleField[i][j] = count;
                count++;
            }
        }
    }

    ngAfterViewInit(): void {}
}
