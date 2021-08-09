export class Unit {
    public type: string;
    public health: number;
    public value: any;

    constructor(type: string, health: number, value: any) {
        this.type = type;
        this.health = health;
        this.value = value;
    }
}

export class WidgetSettings {
    public fieldData: Array<Array<Unit>> = new Array<Array<Unit>>();
    public backgroundImage: string = '/assets/defaultFieldBack.png';;
    public columns: number = 7;
    public rows: number = 7;
    public donatePayWidgetUrl: string = '';
    public donationAlertsWidgetUrl: string = '';
}