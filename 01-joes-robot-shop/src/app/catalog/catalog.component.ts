import { Component } from '@angular/core';
import { IProduct } from './product.model';
import { CartService } from '../cart/cart.service';
import { ProductService } from './product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  products: IProduct[] = [];
  filterCategory = '';

  constructor(
    private cartSvc: CartService,
    private productSvc: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productSvc.getAll().subscribe(productsData => {
      this.products = productsData
    });
    // this.activatedRoute.params.subscribe(params => {
    //   this.filterCategory = params["filter"] ?? '';
    // })
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterCategory = params["filter"] ?? '';
    });
  }

  addToCart(product: IProduct) {
    this.cartSvc.add(product);
    this.router.navigate(["cart"]);
  }

  getFilteredProducts() {
    return this.filterCategory === '' 
    ? this.products
    : this.products.filter((p) => p.category === this.filterCategory);
  }
}
