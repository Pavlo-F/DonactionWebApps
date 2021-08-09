import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageMessageBoxDialog } from '../../../helpers/image-message-box/image-message-box.component';
import { MessageBoxDialog } from '../../../helpers/message-box/message-box.component';

@Component({
    selector: 'image',
    templateUrl: './image.template.html',
    styleUrls: ['./image.styles.scss'],
})

export class ImageComponent implements AfterViewInit, OnDestroy {
    @Input() unitValue: string;
    @Input() isEdit: boolean = false;
    
    private closeTimeout: any;

    constructor(private messageBox: MatDialog) {
        this.unitValue = '';
    }

    ngOnDestroy(): void {
        clearTimeout(this.closeTimeout);
    }

    ngAfterViewInit(): void {
        if (!this.isEdit) {
            this.showImage();
        }
    }

    private showImage() {
        const ref = this.messageBox.open(ImageMessageBoxDialog, {
            width: '90vw',
            height: '90vh',
            data: {
                header: '',
                message: this.unitValue,
                withButtons: false,
            },
        });

        this.closeTimeout = setTimeout(() => {
            ref.close();
        }, 3000);
    }
}