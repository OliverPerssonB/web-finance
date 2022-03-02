import { Component, OnInit } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
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
