import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from '../../../helpers/common';
import { Unit } from '../../units/models';

export interface ChooseUnitDialogData {
    unit: Unit;
}

@Component({
    selector: 'choose-unit-dialog',
    templateUrl: './choose-unit-dialog.template.html',
    styleUrls: ['./choose-unit-dialog.styles.scss'],
})
export class ChooseUnitDialog {
    public unit !: Unit;

    constructor(
        private dialogRef: MatDialogRef<ChooseUnitDialogData>,
        @Inject(MAT_DIALOG_DATA) public data: ChooseUnitDialogData
    ) {
        this.unit = data.unit;
        this.unit.health = 50;
    }

    confirmChoose() {
        this.dialogRef.close(this.unit);
    }

    chooseItem(unitType: string) {
        this.unit.type = unitType;
    }

    unitImageLoaded(file: File) {
        if (file.size > 102400) { // 100 KB
            return;
        } 

        Utils.readImageFile(file).then(
            (data) => {
                this.unit.value = data
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
