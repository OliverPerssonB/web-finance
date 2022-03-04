import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { OverviewComponent } from './overview/overview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PickStocksComponent } from './pick-stocks/pick-stocks.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  { path: "welcome-page", component: WelcomePageComponent },
  { path: "overview", component: OverviewComponent },
  { path: "charts", component: ChartsComponent },
  { path: "pick-stocks", component: PickStocksComponent },
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
