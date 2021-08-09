import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    header: string;
    message: string;
    withButtons: boolean; 
}

@Component({
    selector: 'image-message-box',
    templateUrl: 'image-message-box.template.html',
    styleUrls: ['image-message-box.styles.scss'],
})
export class ImageMessageBoxDialog {
    constructor(private dialogRef: MatDialogRef<ImageMessageBoxDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
