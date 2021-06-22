export class Unit {
    public type: string;
    public health: number;
    public value: number;

    constructor(type: string, health: number, value: number) {
        this.type = type;
        this.health = health;
        this.value = value;
    }
}