import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'bomb',
    templateUrl: './bomb.template.html',
    styleUrls: ['./bomb.styles.scss'],
})

export class BombComponent implements AfterViewInit {
    @Input() health: number;
    @Input() damage: number;

    constructor() {
        this.health = 10;
        this.damage = 50;
    }

    ngAfterViewInit(): void {}
}