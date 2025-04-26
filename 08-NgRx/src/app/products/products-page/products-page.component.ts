import { Component } from '@angular/core';
import { sumProducts } from 'src/app/utils/sum-products';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Store } from '@ngrx/store';
import { ProductsApiActions, ProductsPageActions } from '../state/products.actions';
import { selectProducts, selectProductsErroMessage, selectProductsLoading, selectProductsShowProductCode, selectProductsTotal } from '../state/products.selectors';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  total$ = this.store.select(selectProductsTotal);
  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectProductsLoading);
  showProductCode$ = this.store.select(selectProductsShowProductCode);
  errorMessage$ = this.store.select(selectProductsErroMessage);

  constructor(private store: Store) { }

  toggleShowProductCode() {
    this.store.dispatch(ProductsPageActions.toggleShowProductCode());
  }
}
