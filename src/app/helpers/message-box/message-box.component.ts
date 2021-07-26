import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    header: string;
    message: string;
    withButtons: boolean; 
}

@Component({
    selector: 'message-box',
    templateUrl: 'message-box.template.html',
    styleUrls: ['message-box.styles.scss'],
})
export class MessageBoxDialog {
    constructor(private dialogRef: MatDialogRef<MessageBoxDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
