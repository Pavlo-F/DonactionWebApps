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
    public fieldData: Array<Array<Unit>>;
    public backgroundImage: string;
    public columns: number;
    public rows: number;

    constructor() {
        this.fieldData = new  Array<Array<Unit>>();
        this.backgroundImage = '/assets/defaultFieldBack.png';
        this.columns = 7;
        this.rows = 7;
    }
}