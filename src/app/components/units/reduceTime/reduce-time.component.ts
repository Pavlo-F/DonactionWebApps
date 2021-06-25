import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'reduce-time',
    templateUrl: './reduce-time.template.html',
    styleUrls: ['./reduce-time.styles.scss'],
})

export class ReduceTimeComponent implements AfterViewInit {
    @Input() unitValue: number;

    constructor() {
        this.unitValue = 10;
    }

    ngAfterViewInit(): void {}
}