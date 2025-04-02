import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, Contact, phoneTypeValues } from '../contacts/contact.model';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contact: Contact = {
    id: "",
    personal: false,
    firstName: "",
    lastName: "",
    dateOfBirth: '',
    favoritesRanking: null,
    phone: {
      phoneNumber: "",
      phoneType: "",
    },
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

  saveContact(form: NgForm) {
    // console.log(this.contact);
    console.log(form.value);
    this.contactSvc.saveContact(form.value).subscribe({
      next: () => { this.router.navigate(['/contacts']); },
    })
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}