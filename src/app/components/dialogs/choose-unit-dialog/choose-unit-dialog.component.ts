import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    }

    confirmChoose() {
        this.dialogRef.close(this.unit);
    }

    chooseItem(unitType: string) {
        this.unit.type = unitType;
    }
}
