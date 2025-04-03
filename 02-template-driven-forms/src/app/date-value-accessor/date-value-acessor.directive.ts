import { Directive, ElementRef, forwardRef, HostListener, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_VALUE_PROVIDER: Provider = {
  multi: true, // because there are multiple NG_VALUE_ACESSOR providers.
  provide: NG_VALUE_ACCESSOR, // injection token
  /* The DATE_VALUE_PROVIDER constant is defined BEFORE DateValueAcessorDirective is declared.
  If we directly reference DateValueAcessorDirective in useExisting, Angular would throw an
  undefined reference error. */
  useExisting: forwardRef(() => DateValueAcessorDirective),
}

@Directive({
  // This selector makes this controlValueAcessor to be INJECTED inside input elements of
  // type date which have any of the following attributes: ngModel, formControl or formControlName
  selector:
    'input([type=date])[ngModel],input([type=date])[formControl],input([type=date])[formControlName]',
  standalone: true,
  providers: [DATE_VALUE_PROVIDER]
})
export class DateValueAcessorDirective implements ControlValueAccessor {
  // Listens for the 'input' event on the html element.
  @HostListener("input", ["$event.target.valueAsDate"]) onChange!: Function;
  @HostListener("blur", []) onTouched!: Function;

  constructor(private elementRef: ElementRef) { }

  // flow -> data model to html
  writeValue(date: any): void {
    console.log(date);
    console.log(date instanceof Date);
    if (date instanceof Date) {
      // input[type=date] expects date to be in string format
      this.elementRef.nativeElement.value = date.toISOString().split("T")[0];
    }
  }

  // flow -> html to data model (event based)
  // fn is the function called by US in order to update the data model
  registerOnChange(fn: any): void {
    // console.log("onChange");
    this.onChange = (valueAsDate: Date) => { fn(valueAsDate) };
  }

  // flow -> html to angular (used to register the element as 'touched')
  registerOnTouched(fn: any): void {
    // console.log("onTouched");
    this.onTouched = fn;
  }
}
