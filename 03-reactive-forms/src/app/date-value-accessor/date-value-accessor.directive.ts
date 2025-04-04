import { Directive, ElementRef, forwardRef, HostListener, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_VALUE_PROVIDER: Provider = {
  multi: true,
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
}

@Directive({
  selector: 'input([type=date])[formControl],input([type=date])[formControlName],input([type=date])[ngModel]',
  providers: [DATE_VALUE_PROVIDER],
})
export class DateValueAccessorDirective implements ControlValueAccessor {
  @HostListener('input', ['$event.target.valueAsDate']) onChange!: Function;
  @HostListener('blur') onTouched!: Function;

  constructor(private elementRef: ElementRef) { }

  writeValue(obj: any): void {
    if (obj instanceof Date)
      this.elementRef.nativeElement.value = obj.toISOString().split("T")[0];
  }

  registerOnChange(fn: any): void {
    this.onChange = (date: Date) => { fn(date) };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
