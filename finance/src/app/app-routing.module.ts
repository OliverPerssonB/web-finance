import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { PickStocksComponent } from './pick-stocks/pick-stocks.component';

const routes: Routes = [
  { path: "overview", component: ChartsComponent },
  { path: "charts", component: ChartsComponent },
  { path: "pick-stocks", component: PickStocksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
