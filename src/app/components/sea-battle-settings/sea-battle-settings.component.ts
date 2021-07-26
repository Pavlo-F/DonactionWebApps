import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Unit, WidgetSettings } from '../units/models';
import { UniteTypes } from '../constants';
import { ActivatedRoute } from '@angular/router';
import { SeaBattleService } from '../../services/sea-battle.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxDialog } from '../../helpers/message-box/message-box.component';

@Component({
    selector: 'sea-battle-settings',
    templateUrl: './sea-battle-settings.template.html',
    styleUrls: ['./sea-battle-settings.styles.scss'],
})

export class SeaBattleSettingsComponent implements AfterViewInit {
    public widgetSettings: WidgetSettings = new WidgetSettings();
    public saveButtonDisabled: boolean = false;

    private widgetCode: string = '';

    constructor(
        private httpClient: HttpClient, 
        private route: ActivatedRoute,
        private messageBox: MatDialog,
        private seaBattleService: SeaBattleService) {
        const widgetCode = this.route.snapshot.paramMap.get('widgetCode');
        this.widgetCode = widgetCode ? widgetCode : '';
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (!this.widgetSettings.fieldData || this.widgetSettings.fieldData.length < 1) {
                this.fillRandom();
            }
        }, 1000);

    }

    backgroundLoaded(file: any) {
        this.widgetSettings.backgroundImage = URL.createObjectURL(file);
        const imageFile = file;
    }

    fillRandom() {
        for(let i = 0; i < this.widgetSettings.rows; i++) {
            this.widgetSettings.fieldData[i] = [];

            for(let j = 0; j < this.widgetSettings.columns; j++) {
                const rand = Math.random();
                const unit = new Unit(UniteTypes.Text, 50, 'Текст');

                if (rand > 0.5 && rand <= 0.8) {
                    unit.type = UniteTypes.ReduceTime;
                } else if (rand > 0.8) {
                    unit.type = UniteTypes.IncreaseTime;
                }

                this.widgetSettings.fieldData[i][j] = unit;
            }
        }
    }

    resort() {
        const field = this.widgetSettings.fieldData;
        for (let i = field.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [field[i],field[j]] = [field[j],field[i]];

            for (let ii = field[i].length - 1; ii > 0; ii--) {
                let jj = Math.floor(Math.random() * (ii + 1));
               const tmp = field[i][ii];
              field[i][ii] = field[i][jj];
              field[i][jj] = tmp;
            }
        }
    }

    saveSettings() {
        this.saveButtonDisabled = true;
        this.seaBattleService.saveSettings(this.widgetSettings, this.widgetCode).subscribe((data) => {
            this.saveButtonDisabled = false;
        }, (error) => {
            this.saveButtonDisabled = false;
            console.log(error);

            const ref = this.messageBox.open(MessageBoxDialog, {
                width: '600px',
                data: {
                    header: '',
                    message: error.message,
                    withButtons: true,
                },
            });
        });
    }
}
