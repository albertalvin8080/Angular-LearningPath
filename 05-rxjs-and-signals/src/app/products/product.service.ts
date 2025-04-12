import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Product } from './product';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

interface Result<T> {
  data: T | undefined,
  err?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient, private reviewService: ReviewService) { }

  private productsUrl = 'api/products';

  private selectedProductIdSubject = new BehaviorSubject<number | null>(null);
  readonly selectedProductId$ = this.selectedProductIdSubject.asObservable();
  readonly selectedProductIdSig = signal<number | undefined>(undefined);

  readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(p => console.log(p)),
      shareReplay(1),
    );

  readonly productsResult$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map((p) => ({ data: p } as Result<Product[]>)),
      tap(p => console.log(p)),
      shareReplay(1),
      catchError((err) => {
        console.log(err.body.error);
        return of({ data: [], err: err.body.error } as Result<Product[]>);
      }),
    );

  private productsResultSig = toSignal(this.productsResult$,
    { initialValue: { data: [] } as Result<Product[]> });
  productsSig = computed(() => this.productsResultSig()?.data);
  productsErrSig = computed(() => this.productsResultSig()?.err);

  // readonly product1$ = this.selectedProductId$.pipe(
  readonly productResult$ = toObservable(this.selectedProductIdSig).pipe(
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
    map(product => {
      return { data: product } as Result<Product>;
    }),
  );
  private productResultSig = toSignal(this.productResult$);
  productSig = computed(() => this.productResultSig()?.data);
  productErrSig = computed(() => this.productResultSig()?.err);

  // combineLatest caches/buffers the last emission from each observable
  product$ = combineLatest([
    // this.selectedProductId$,
    toObservable(this.selectedProductIdSig),
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
    this.selectedProductIdSubject.next(id);
    this.selectedProductIdSig.set(id);
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
