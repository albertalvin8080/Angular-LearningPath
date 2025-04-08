import { effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartItems = signal<CartItem[]>([]);

  e = effect(() => console.log("Cart length: " + this.cartItems().length));

  addToCart(item: Product) {
    this.cartItems.update(previous => [...previous, { product: item, quantity: 1 }]);
  }
}
