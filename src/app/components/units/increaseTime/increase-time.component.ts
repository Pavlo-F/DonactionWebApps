import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'increase-time',
    templateUrl: './increase-time.template.html',
    styleUrls: ['./increase-time.styles.scss'],
})

export class IncreaseTimeComponent implements AfterViewInit {
    @Input() unitValue: number;

    constructor() {
        this.unitValue = 10;
    }

    ngAfterViewInit(): void {}
}