import { Injectable } from '@angular/core';
import { IProduct } from './catalog/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: IProduct[] = []

  constructor() { }
  
  add(product: IProduct) {
      console.log(`${product.name} added to cart`);
      this.cart.push(product);
    }
}
