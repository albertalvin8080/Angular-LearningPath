import { Injectable } from "@angular/core";
import { ProductsService } from "../products.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProductsApiActions, ProductsPageActions } from "./products.actions";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class ProductsEffects {
    constructor(private actions$: Actions, private productsService: ProductsService, private router: Router) { }

    ngrxOnInitEffects() {
        return ProductsPageActions.loadProducts();
    }

    loading$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsPageActions.loadProducts),
            exhaustMap(() => this.productsService.getAll().pipe(
                map(products => ProductsApiActions.productsLoadedSuccess({ products })),
                catchError((err) => of(ProductsApiActions.productsLoadedFail({ message: err })))
            )),
        )
    )

    addProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsPageActions.addProduct),
            mergeMap(({ product }) => this.productsService.add(product).pipe(
                map(product => ProductsApiActions.productAddedSuccess({ product })),
                catchError((err) => of(ProductsApiActions.productAddedFail({ message: err })))
            )),
        )
    )

    updateProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsPageActions.updateProduct),
            concatMap(({ product }) => this.productsService.update(product).pipe(
                map(_ => ProductsApiActions.productUpdatedSuccess(
                    { update: { id: product.id, changes: product } }
                )),
                catchError((err) => of(ProductsApiActions.productUpdatedFail({ message: err })))
            )),
        )
    )

    deleteProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductsPageActions.deleteProduct),
            concatMap(({ id }) => this.productsService.delete(id).pipe(
                map(_ => ProductsApiActions.productDeletedSuccess({ id })),
                catchError((err) => of(ProductsApiActions.productDeletedFail({ message: err })))
            )),
        )
    )

    // No '$' because this one doesn't return an Action.
    routeToProductsPage = createEffect(
        () => this.actions$.pipe(
            ofType(
                ProductsApiActions.productAddedSuccess,
                ProductsApiActions.productUpdatedSuccess,
                ProductsApiActions.productDeletedSuccess,
            ),
            tap(() => this.router.navigate(['/products'])),
        ),
        { dispatch: false } // tells the effect that the function above will NOT return another Action.
    );
}