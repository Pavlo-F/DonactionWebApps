import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'unit-container',
    templateUrl: './unit-container.template.html',
    styleUrls: ['./unit-container.styles.scss'],
})

export class UnitContainerComponent implements AfterViewInit {
    @Input() unitType: string = '';
    @Input() health: number = -1;
    @Input() unitValue: any = {};
    @Input() isEdit: boolean = false;

    constructor() {}

    ngAfterViewInit(): void {}
}