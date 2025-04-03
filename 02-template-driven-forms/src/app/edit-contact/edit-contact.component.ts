import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, Contact, phoneTypeValues } from '../contacts/contact.model';
import { RestrictedWordsValidator } from '../validators/restricted-words-validator.directive';
import { DateValueAcessorDirective } from '../date-value-accessor/date-value-acessor.directive';
import { ProfileIconSelectorComponent } from '../profile-icon-selector/profile-icon-selector.component';

@Component({
  imports: [CommonModule, FormsModule, RestrictedWordsValidator, DateValueAcessorDirective, ProfileIconSelectorComponent],
  standalone: true,
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contact: Contact = {
    id: "",
    icon: '',
    personal: false,
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    favoritesRanking: null,
    phones: [{
      phoneNumber: "",
      phoneType: "",
    }],
    address: {
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      addressType: "",
    },
    notes: "",
  };

  constructor(
    private route: ActivatedRoute,
    private contactSvc: ContactsService,
    private router: Router,
  ) { }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return
    this.contactSvc.getContact(contactId).subscribe(contact => {
      if (contact)
        this.contact = contact;
    });
  }

  addPhone() {
    this.contact.phones.push({
      phoneNumber: '',
      phoneType: '',
    });
  }

  saveContact(form: NgForm) {
    // console.log(this.contact);
    console.log(form.value);
    this.contactSvc.saveContact(this.contact).subscribe({
      next: () => { this.router.navigate(['/contacts']); },
    })
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}