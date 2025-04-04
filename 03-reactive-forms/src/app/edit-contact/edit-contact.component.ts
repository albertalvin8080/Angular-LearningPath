import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { restrictedWordsValidator } from '../validators/restricted-words.validator';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  // contactForm = new FormGroup({
  //   id: new FormControl(),
  //   firstName: new FormControl(),
  //   lastName: new FormControl(),
  //   dateOfBirth: new FormControl(),
  //   favoritesRanking: new FormControl(),
  //   phone: new FormGroup({
  //     phoneNumber: new FormControl(),
  //     phoneType: new FormControl(),
  //   }),
  //   address: new FormGroup({
  //     streetAddress: new FormControl(),
  //     city: new FormControl(),
  //     state: new FormControl(),
  //     postalCode: new FormControl(),
  //     addressType: new FormControl(),
  //   }),
  // });

  contactForm = this.fb.nonNullable.group({
    id: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>0,
    phones: this.fb.array([
      this.createPhoneGroup()
    ]),
    address: this.fb.nonNullable.group({
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      addressType: ['', [Validators.required]],
    }),
    notes: ['', [restrictedWordsValidator(['foo', 'bar'])]],
  });

  subscribeToAddressChanges() {
    const addressGroup = this.contactForm.controls.address;
    // Remove validators so erros don't appear right away when the user starts typing.
    addressGroup.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(_value => {
        for (let controlName in addressGroup.controls) {
          const control = addressGroup.get(controlName);
          control?.removeValidators([Validators.required]);
          control?.updateValueAndValidity();
        }
      });
    // Add validators back after 2050 miliseconds to show errors.
    addressGroup.valueChanges
      .pipe(debounceTime(2050), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(_value => {
        for (let controlName in addressGroup.controls) {
          const control = addressGroup.get(controlName);
          control?.addValidators([Validators.required]);
          control?.updateValueAndValidity();
        }
      });
  }

  createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false,
    });

    phoneGroup.controls.preferred.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))) // prevents infinite loop
      .subscribe(value => {
        if (value)
          phoneGroup.controls.phoneNumber.addValidators([Validators.required]);
        else
          phoneGroup.controls.phoneNumber.removeValidators([Validators.required]);
        phoneGroup.controls.phoneNumber.updateValueAndValidity(); // could cause infinite loop
      });

    return phoneGroup;
  }

  addPhoneGroup() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  constructor(
    private route: ActivatedRoute,
    private contactSvc: ContactsService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) {
      this.subscribeToAddressChanges();
      return;
    }
    this.contactSvc.getContact(contactId).subscribe(contact => {
      if (!contact) return;

      for (let i = 1; i < contact.phones.length; ++i)
        this.addPhoneGroup(); // Creating space for more phone FormGroups (each phone is a FormGroup).

      this.contactForm.setValue(contact);
      // this.contactForm.patchValue(contact); // if contact didnt implement the whole contract
      
      this.subscribeToAddressChanges();
    });
  }

  saveContact() {
    this.contactSvc.saveContact(this.contactForm.getRawValue())
      .subscribe({
        next: () => { this.router.navigate(['/contacts']); },
      });
  }
}
