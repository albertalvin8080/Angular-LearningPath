import { Component, computed, Input, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  constructor(private cartSvc: CartService) {}

  // @Input({ required: true }) cartItem!: CartItem;
  @Input({required: true}) set cartItem(ci: CartItem) {
    this.cartItemSig.set(ci);
  }

  cartItemSig = signal<CartItem>(undefined!); // DONT do this un production.

  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  qtyArr = [...Array(8).keys()].map(x => x + 1);

  // Calculate the extended price
  exPrice = computed(() => this.cartItemSig().quantity * this.cartItemSig().product.price);

  onQuantitySelected(quantity: number): void {
    this.cartSvc.updateQuantity(this.cartItemSig(), Number(quantity));
  }

  removeFromCart(): void {
    this.cartSvc.remove(this.cartItemSig());
  }
}
