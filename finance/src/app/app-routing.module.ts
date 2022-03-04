import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { OverviewComponent } from './overview/overview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PickStocksComponent } from './pick-stocks/pick-stocks.component';

const routes: Routes = [
  { path: "overview", component: OverviewComponent },
  { path: "charts", component: ChartsComponent },
  { path: "pick-stocks", component: PickStocksComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
