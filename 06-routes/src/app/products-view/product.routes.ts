import { Route, Routes } from "@angular/router";
import { DetailViewComponent } from "./detail-view/detail-view.component";
import { CustomizeViewComponent } from "./customize-view/customize-view.component";

export enum PRODUCT_ROUTES_TOKENS {
    DETAIL = 'detail',
    CUSTOM = 'custom',
}

export const PRODUCT_ROUTES: Routes = [
    {
        path: PRODUCT_ROUTES_TOKENS.DETAIL,
        component: DetailViewComponent,
    },
    {
        path: PRODUCT_ROUTES_TOKENS.CUSTOM,
        component: CustomizeViewComponent,
    }
];