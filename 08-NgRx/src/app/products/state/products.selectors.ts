import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromProducts from "./products.reducers";
import { sumProducts } from "src/app/utils/sum-products";
import { getRouterSelectors } from "@ngrx/router-store";

export const selectProductState = createFeatureSelector<fromProducts.ProductsState>('products');

export const selectProducts = createSelector(
    selectProductState,
    fromProducts.selectAllProducts,
)

// This one is necessary due to usage of createFeatureSelector<>
export const selectProductEntities = createSelector(
    selectProductState,
    fromProducts.selectAllProductEntities
)

export const selectProductsLoading = createSelector(
    selectProductState,
    (state) => state.loading
)

export const selectProductsShowProductCode = createSelector(
    selectProductState,
    (state) => state.showProductCode,
)

export const selectProductsErroMessage = createSelector(
    selectProductState,
    (state) => state.errorMessage,
)

export const selectProductsTotal = createSelector(
    selectProducts,
    (products) => sumProducts(products),
)

const {
    selectRouteParams
} = getRouterSelectors();

export const selectProductById = createSelector(
    selectProductEntities,
    selectRouteParams,
    (productsDict, { id }) => productsDict[id],
)