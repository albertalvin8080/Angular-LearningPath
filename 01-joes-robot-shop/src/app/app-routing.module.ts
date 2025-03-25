import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SignInComponent } from './user/sign-in/sign-in.component';

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent, title: "Home" },
  { path: "catalog", component: CatalogComponent, title: "Catalog" },
  // { path: "catalog/:filter", component: CatalogComponent, title: "Catalog" },
  { path: "cart", component: CartComponent, title: "Cart" },
  { path: "sign-in", component: SignInComponent, title: "Sign In" },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule] // You could also import RouterModule directly inside app.module.ts instead.
})
export class AppRoutingModule { }
