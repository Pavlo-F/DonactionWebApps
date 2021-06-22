import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'unit-container',
    templateUrl: './unit-container.template.html',
    styleUrls: ['./unit-container.styles.scss'],
})

export class UnitContainerComponent implements AfterViewInit {
    @Input() unitType: string;
    @Input() health: number;
    @Input() unitValue: number;

    constructor() {
        this.unitType = ''; 
        this.health = -1;
        this.unitValue = -1;
    }

    ngAfterViewInit(): void {}
}