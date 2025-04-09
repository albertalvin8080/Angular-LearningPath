import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartItems = signal<CartItem[]>([]);

  readonly cartCount = computed(() => this.cartItems()
    .reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subTotal = computed(() => this.cartItems()
    .reduce((acc, items) => acc + (items.product.price * items.quantity), 0)
  );

  readonly deliveryFee = computed(() => this.subTotal() > 50 ? 0 : 5.99);

  readonly tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

  readonly total = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  e = effect(() => console.log("Cart length: " + this.cartItems().length));

  addToCart(item: Product) {
    this.cartItems.update(previous => [...previous, { product: item, quantity: 1 }]);
  }

  updateQuantity(toUpdate: CartItem, qty: number) {
    this.cartItems.update((cartItems) => cartItems.map((item) => {
      return item.product.id === toUpdate.product.id
        ? { ...item, quantity: qty }
        : item;
    }));
  }

  remove(toRemove: CartItem) {
    this.cartItems.update((items) => items.filter(item => {
      return item.product.id !== toRemove.product.id;
    }));
  }
}
