import { Component, OnInit } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';

@Component({
  selector: 'app-pick-stocks',
  templateUrl: './pick-stocks.component.html',
  styleUrls: ['./pick-stocks.component.css']
})
export class PickStocksComponent implements OnInit {
  private subscription: any;
  private data: any;

  constructor(private server: YahooHttpService) { }

  ngOnInit(): void {
    this.data = stockDataApple;
    console.log("Data available:");
    console.log("-------------");
    console.log(this.data);
    console.log("-------------");
  }

  fetchData() {
    let data = this.server.getStock();
    this.subscription = data.subscribe(obj => {
      console.log("Received data from server:");
      console.log("--------");
      console.log(obj);
      console.log("--------");
    });
  }

  onDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
