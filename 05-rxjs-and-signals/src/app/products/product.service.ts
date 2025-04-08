import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient, private reviewService: ReviewService) { }

  private selectedProductSubject = new BehaviorSubject<number | null>(null);
  readonly selectedProduct$ = this.selectedProductSubject.asObservable();

  private productsUrl = 'api/products';

  readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(p => console.log(p)),
      shareReplay(1),
    );

  readonly product1$ = this.selectedProduct$.pipe(
    filter(Boolean), // filters null | undefined
    switchMap(
      (id) => {
        return this.http.get<Product>(`${this.productsUrl}/${id}`)
          .pipe(
            switchMap(product => {
              return this.getProductWithReviews(product);
            }),
          );
      },
    ),
  );

  // combineLatest caches/buffers the last emission from each observable
  product$ = combineLatest([
    this.selectedProduct$,
    this.products$,
  ])
    .pipe(
      // tap(([selectedProductId, products]) => console.log(selectedProductId)),
      map(([selectedProductId, products]) => products.find(product => selectedProductId === product.id)),
      // tap(p => console.log(p)),
      filter(Boolean),
      switchMap(product => {
        return this.getProductWithReviews(product);
      }),
    );

  selectProduct(id: number) {
    this.selectedProductSubject.next(id);
  }

  // getById(id: number): Observable<Product> {
  //   return this.http.get<Product>(`${this.productsUrl}/${id}`);
  // }

  getProductWithReviews(product: Product): Observable<Product> {
    if (!product.hasReviews)
      return of(product);

    return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        map(reviews => {
          return { ...product, reviews };
        }),
      );
  }
}
