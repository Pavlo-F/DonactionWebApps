import { AfterViewInit, Component } from '@angular/core';
import { Unit, WidgetSettings } from '../units/models';
import { UniteTypes } from '../constants';
import { ActivatedRoute } from '@angular/router';
import { SeaBattleService } from '../../services/sea-battle.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxDialog } from '../../helpers/message-box/message-box.component';
import { Utils } from '../../helpers/common';

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
    public isSaving: boolean = false;

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

    backgroundLoaded(file: File) {
        if (file.size > 1048576) {
            return;
        }

        Utils.readImageFile(file).then(
            (data) => {
                this.widgetSettings.backgroundImage = data
                this.showSaveMessage = true;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    removeBackground() {
        this.widgetSettings.backgroundImage = '';
        this.checkCanSave();
    }

    fillRandom() {
        for(let i = 0; i < this.widgetSettings.rows; i++) {
            this.widgetSettings.fieldData[i] = [];

            for(let j = 0; j < this.widgetSettings.columns; j++) {
                const rand = Math.random();
                const unit = new Unit(UniteTypes.Text, this.widgetSettings.minHealth, 'Текст');

                if (rand > 0.5 && rand <= 0.8) {
                    unit.type = UniteTypes.Image;
                    unit.value = null;
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
        this.isSaving = true;
        this.applyMinHealth();

        this.saveButtonDisabled = true;
        this.seaBattleService.saveSettings(this.widgetSettings, this.widgetCode).subscribe((data) => {
            this.saveButtonDisabled = false;
            this.showSaveMessage = false;
            this.isSaving = false;
        }, (error) => {
            this.isSaving = false;
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

            if (!data || !data.fieldData || !data.fieldData.length) {
                this.widgetSettings = new WidgetSettings();
                this.fillRandom();
            }

            this.saveButtonDisabled = data && !data.donatePayWidgetUrl;

        }, (error) => {
            const ref = this.messageBox.open(MessageBoxDialog, {
                width: '600px',
                data: {
                    header: 'Ошибка',
                    message: `Не удалось загрузить настройки. Перезагрузите страницу. ${error.error}`,
                    withButtons: true,
                },
            });

            console.log(error);
        });
    }

    onRowsChange() {
        this.changeFieldSize();
        this.checkCanSave();
    } 

    onColumnsChange() {
        this.changeFieldSize();
        this.checkCanSave();
    }

    onDonatePayWidgetUrlChange() {
         this.checkCanSave();
    }

    onDonationAlertsWidgetUrlChange() {
        this.checkCanSave();
    }

    onFieldChanged() {
        this.checkCanSave();
    }

    onMinHealthChange() {
        this.checkCanSave();
    }

    private applyMinHealth() {
        this.widgetSettings.fieldData.forEach((row) => {
            row.forEach((col) => {
                col.health = this.widgetSettings.minHealth;
            });
        });
    }

    private checkCanSave() {
        this.saveButtonDisabled = (!this.widgetSettings.donatePayWidgetUrl && !this.widgetSettings.donationAlertsWidgetUrl)
        || (!this.widgetSettings.donatePayWidgetUrl.startsWith('https://') && !this.widgetSettings.donationAlertsWidgetUrl.startsWith('https://'));

        this.showSaveMessage = !this.saveButtonDisabled;
    }

    private changeFieldSize() {
        const newfieldData: Array<Array<Unit>> = new Array<Array<Unit>>();

        for(let i = 0; i < this.widgetSettings.rows; i++) {
            newfieldData[i] = this.widgetSettings.fieldData[i] ? this.widgetSettings.fieldData[i].slice(0, this.widgetSettings.columns) : [];

            for(let j = 0; j < this.widgetSettings.columns; j++) {
                if (this.widgetSettings.fieldData[i] && this.widgetSettings.fieldData[i][j]) {
                    newfieldData[i][j] = this.widgetSettings.fieldData[i][j];
                } else {
                    newfieldData[i][j] = new Unit(UniteTypes.Text, this.widgetSettings.minHealth, 'Текст');
                }

            }
        }

        this.widgetSettings.fieldData = newfieldData;
    }
}
