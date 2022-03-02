import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { YahooHttpService } from '../yahoo-http.service';
import { overviewData } from '../localData';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private subscription: any;
  private data: any;

  constructor(private server: YahooHttpService) { }

  ngOnInit(): void {
    this.data = overviewData;
    console.log("Data available:");
    console.log("-------------");
    console.log(this.data);
    console.log("-------------");
  }

  fetchData() {
    let data = this.server.getMarketSummary();
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
