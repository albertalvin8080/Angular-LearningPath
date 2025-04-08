import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  constructor(private productSvc: ProductService, private cartService: CartService) { }

  errorMessage = '';

  pageTitle = `Product Detail`;

  readonly product$ = this.productSvc.product$;

  addToCart(product: Product) {
    // console.log(product);
    this.cartService.addToCart(product);
  }
}
