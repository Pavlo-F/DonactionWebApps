import { Directive, ElementRef, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    host: { '(input)': 'onChange($event.target)' },
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IntNumberDirective),
        },
    ],
    selector: 'input[intNumber]',
})
export class IntNumberDirective {
    @Input('allowDash') public allowDash: boolean = false;
    @Input('initialZero') public initialZero: boolean = false;
    @Input('allowMinus') public allowMinus: boolean = false;
    @Input('min') public min: string = Number.MIN_VALUE.toString();
    @Input('max') public max: string = Number.MAX_VALUE.toString();

    public intRegex: RegExp = /^\d+$/;
    public intMinusRegex: RegExp = /^[+-]?\d+$/;
    public dashRegex: RegExp = /^(-|–|—)$/;

    public prevValue: string = '';
    public propagateChange !: (_: any) => void;

    constructor(private inputTextElement: ElementRef) {}

    public writeValue(value: number): void {
        if (value || (this.initialZero && value === 0)) {
            this.inputTextElement.nativeElement.value = value;
            this.prevValue = value ? '' + value : '';
        }
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(_: any): void {
        return;
    }

    public onChange(element: any) {
        let regex = this.intRegex;

        let value: string = element.value;

        if (this.allowMinus) {
            regex = this.intMinusRegex;
        }

        if (!this.allowDash || !this.dashRegex.test(value)) {
            if (!value) {
                value = '0';
            } else if (!regex.test(value)) {
                value = this.prevValue;
            } else {
                value = String(+value);
            }
        }

        const testNumber = Number(value);
        if (testNumber > Number(this.max)) {
            value = this.max.toString();
        } else if (testNumber < Number(this.min)) {
            value = this.min.toString();
        }

        this.prevValue = value;
        element.value = value;
        this.propagateChange(element.value);
    }
}
