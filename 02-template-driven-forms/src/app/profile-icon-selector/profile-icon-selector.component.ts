import { CommonModule } from '@angular/common';
import { Component, forwardRef, Provider } from '@angular/core';
import { profileImgsValues } from './profile.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const PROFILE_ICON_VALUE_ACESSOR: Provider = {
  multi: true,
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponent)
}

@Component({
  selector: 'con-profile-icon-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-icon-selector.component.html',
  styleUrl: './profile-icon-selector.component.css',
  providers: [PROFILE_ICON_VALUE_ACESSOR],
})
export class ProfileIconSelectorComponent implements ControlValueAccessor {
  profileImgs = profileImgsValues;
  showAllIcons = true;
  selectedIcon!: string | null;

  onChange!: Function;
  onTouched!: Function;

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.showAllIcons = false;
    this.onChange(icon); // Thats why we dont need a @HostListener onChange
  }

  writeValue(icon: null | string): void {
    this.selectedIcon = icon;

    if (icon && icon !== '')
      this.showAllIcons = false;
    else
      this.showAllIcons = true;
  }

  // fn takes the value indicated by [(ngModel)] and sends it up to the data model (the contact object).
  registerOnChange(fn: Function): void {
    this.onChange = (icon: string) => {fn(icon);}
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
