import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxDialog } from '../../../helpers/message-box/message-box.component';

@Component({
    selector: 'text',
    templateUrl: './text.template.html',
    styleUrls: ['./text.styles.scss'],
})

export class TextComponent implements AfterViewInit, OnDestroy {
    @Input() unitValue: string;
    @Input() isEdit: boolean = false;
    
    private closeTimeout: any;

    constructor(private messageBox: MatDialog) {
        this.unitValue = '';
    }

    ngOnDestroy(): void {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
        }
    }

    ngAfterViewInit(): void {
        if (!this.isEdit) {
            this.showText();
        }
    }

    private showText() {
        const ref = this.messageBox.open(MessageBoxDialog, {
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