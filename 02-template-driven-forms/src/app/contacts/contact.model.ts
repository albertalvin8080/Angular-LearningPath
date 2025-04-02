export interface Contact {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  favoritesRanking: number | null,
  phone: Phone,
  address: Address,
  personal: boolean,
  notes: string,
}

export interface Phone {
  phoneNumber: string,
  phoneType: string,
}

export interface Address {
  streetAddress: string,
  city: string,
  state: string,
  postalCode: string,
  addressType: string,
}

export const phoneTypeValues = ["mobile", "work", "other"];

export const addressTypeValues = ["mobile", "work", "other"];