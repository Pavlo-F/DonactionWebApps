import { AfterViewInit, Component } from '@angular/core';
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
    public saveButtonDisabled: boolean = true;
    public showSaveMessage: boolean = false;
    public widgetHref: string = '';

    private widgetCode: string = '';
    
    constructor(
        private route: ActivatedRoute,
        private messageBox: MatDialog,
        private seaBattleService: SeaBattleService) {
        this.widgetCode = this.route.snapshot.queryParams.widgetCode;
        this.widgetHref = window.location.href.replace('/settings?', '?');
    }

    ngAfterViewInit(): void {
        this.loadSettings();
    }

    backgroundLoaded(file: any) {
        this.readFile(file).then(
            (data) => {
                this.widgetSettings.backgroundImage = data
                this.showSaveMessage = true;
            },
            (error) => {
                console.log(error);
            }
        );
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

        this.showSaveMessage = true;
    }

    saveSettings() {
        this.saveButtonDisabled = true;
        this.seaBattleService.saveSettings(this.widgetSettings, this.widgetCode).subscribe((data) => {
            this.saveButtonDisabled = false;
            this.showSaveMessage = false;
        }, (error) => {
            this.saveButtonDisabled = false;
            this.showSaveMessage = false;
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

    loadSettings() {
        this.seaBattleService.getSettings(this.widgetCode).subscribe((data) => {
            this.widgetSettings = data;

            if (!data || data.fieldData.length < 1) {
                this.fillRandom();
            }

            this.saveButtonDisabled = data && !data.donatePayWidgetUrl;

        }, (error) => {
            this.fillRandom();
            console.log(error);
        });
    }

    onDonatePayWidgetUrlChange() {
         this.saveButtonDisabled = !this.widgetSettings.donatePayWidgetUrl 
             || !this.widgetSettings.donatePayWidgetUrl.startsWith('https://');

        this.showSaveMessage = true;
    }

    onFieldChanged() {
        this.showSaveMessage = true;
    }

    private readFile(data: Blob): Promise<string> {
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(data);
        });
    }
}
