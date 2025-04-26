import { createAction, createReducer, on } from "@ngrx/store";
import { ProductsApiActions, ProductsPageActions } from "./products.actions";
import { Product } from "../product.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

export interface ProductsState extends EntityState<Product> {
    showProductCode: boolean;
    loading: boolean;
    errorMessage: string;
    // ids: string[] | number[]; // these are inside the parent interface.
    // entities: Dictionary<T>;
}

const adapter = createEntityAdapter<Product>({});

const initialState: ProductsState = adapter.getInitialState({
    showProductCode: false,
    loading: false,
    errorMessage: '',
})

export const productsReducer = createReducer(
    initialState, // Initial State Slice
    on(
        ProductsPageActions.toggleShowProductCode,
        (state) => ({ ...state, showProductCode: !state.showProductCode }),
    ),
    on(
        ProductsPageActions.loadProducts,
        (state) => adapter.setAll([], {
            ...state,
            loading: true,
            errorMessage: '',
        })
    ),
    on(ProductsPageActions.addProduct, (state) => ({
        ...state,
        loading: true,
        errorMessage: '',
    })),
    on(ProductsPageActions.deleteProduct, (state) => ({
        ...state,
        loading: true,
        errorMessage: '',
    })),
    on(ProductsPageActions.updateProduct, (state) => ({
        ...state,
        loading: true,
        errorMessage: '',
    })),
    on(
        ProductsApiActions.productsLoadedSuccess,
        (state, { products }) => adapter.setAll(products, {
            ...state,
            loading: false
        })
    ),
    on(
        ProductsApiActions.productsLoadedFail,
        (state, { message }) => adapter.setAll([], {
            ...state,
            loading: false,
            errorMessage: message
        })
    ),
    on(
        ProductsApiActions.productAddedFail,
        (state, { message }) => ({ ...state, errorMessage: message, loading: false, })
    ),
    on(
        ProductsApiActions.productAddedSuccess,
        (state, { product }) => adapter.addOne(product, {
            ...state,
            loading: false,
        })
    ),
    on(
        ProductsApiActions.productUpdatedFail,
        (state, { message }) => ({
            ...state,
            errorMessage: message,
            loading: false,
        })
    ),
    on(
        ProductsApiActions.productUpdatedSuccess,
        (state, { update }) => adapter.updateOne(update, {
            ...state,
            loading: false,
        })
    ),
    on(
        ProductsApiActions.productDeletedFail,
        (state, { message }) => ({ ...state, errorMessage: message, loading: false, })
    ),
    on(
        ProductsApiActions.productDeletedSuccess,
        (state, { id }) => adapter.removeOne(id, {
            ...state,
            loading: false,
        })
    ),
);

const {
    selectAll,
    selectEntities,
} = adapter.getSelectors();

export const selectAllProducts = selectAll;
export const selectAllProductEntities = selectEntities;