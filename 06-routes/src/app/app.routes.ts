import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProductsViewComponent } from './products-view/products-view.component';
import { PRODUCT_ROUTES } from './products-view/product.routes';
import { CartComponent } from './cart/cart.component';
import { HomeUpdatedComponent } from './home-updated/home-updated.component';
import { inject } from '@angular/core';
import { FeatureFlagService } from './services/feature-flag.service';
import { map } from 'rxjs';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { authGuard } from './cart-auth-route-guard';

export enum ROUTER_TOKENS {
  HOME = 'home',
  SHOP = 'shop',
  CONTACT = 'contact',
  ABOUT = 'about',
  CHECKOUT = 'checkout',
  CART = 'cart',
  NOT_AUTH = 'not-auth',
  NOT_FOUND = 'not-found',
}

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: ROUTER_TOKENS.HOME,
    pathMatch: 'full',
  },
  {
    path: ROUTER_TOKENS.HOME,
    component: HomeUpdatedComponent,
    canMatch: [
      () => {
        const featSvc = inject(FeatureFlagService);
        return featSvc.featureFlags.pipe(map(r => !!r.home));
      }
    ],
  },
  {
    path: ROUTER_TOKENS.HOME,
    component: HomeComponent,
  },
  {
    path: `${ROUTER_TOKENS.SHOP}/:categoryId`,
    component: ProductsViewComponent,
    children: PRODUCT_ROUTES,
  },
  {
    path: ROUTER_TOKENS.CONTACT,
    component: ContactComponent,
    canActivate: [
      () => {
        const featSvc = inject(FeatureFlagService);
        const router = inject(Router);
        return featSvc.featureFlags.pipe(map(r => !!r.contact || router.parseUrl(`/${ROUTER_TOKENS.NOT_FOUND}`)));
      },
      authGuard(ROUTER_TOKENS.CONTACT),
    ]
  },
  {
    path: ROUTER_TOKENS.ABOUT,
    component: AboutComponent,
    canActivate: [
      authGuard(ROUTER_TOKENS.ABOUT)
    ]
  },
  {
    path: ROUTER_TOKENS.CHECKOUT,
    outlet: ROUTER_TOKENS.CART,
    component: CartComponent,
  },
  {
    path: ROUTER_TOKENS.NOT_AUTH,
    component: NotAuthorizedComponent,
  },
  {
    path: ROUTER_TOKENS.NOT_FOUND,
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
