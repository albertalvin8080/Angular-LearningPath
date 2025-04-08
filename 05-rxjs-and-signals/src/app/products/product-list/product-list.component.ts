import { Component } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  constructor(private productSvc: ProductService) { }

  pageTitle = 'Products';
  errorMessage = '';

  readonly selectedProduct$ = this.productSvc.selectedProduct$;

  // Declarative approach for AsyncPipe
  readonly products$ = this.productSvc.products$;

  onSelected(productId: number): void {
    this.productSvc.selectProduct(productId);
  }

}
