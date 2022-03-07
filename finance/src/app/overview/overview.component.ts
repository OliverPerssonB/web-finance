import { Component, OnInit } from '@angular/core';
import { Observable, retry, retryWhen, tap } from 'rxjs';
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
  public displayData: any[] = [];

  constructor(private server: YahooHttpService) { }

  ngOnInit(): void {
    this.fetchDataLocal();
    // this.fetchDataServerCatchError();
  }

  formatData() {
    const results = this.data?.marketSummaryResponse?.result;
    if (results) {
      this.displayData = results.map((exchangeObj: any) => {
        return this.handleExchangeObj(exchangeObj);
      })
    }
  }

  handleExchangeObj(obj: any) {
    return obj;
  }


  fetchDataServerCatchError(retires = 10) {
    let data = this.server.getMarketSummary();
    this.subscription = data.subscribe({
      next: (obj) => {
        console.log("Received data from server:");
        console.log("--------");
        console.log(obj);
        console.log("--------");
        this.data = obj;
        this.formatData();
      },
      error: (err) => {
        if (retires > 0) {
          console.log(`Error when sending HTTP, trying again! Retry left: ${retires}`);
          this.fetchDataServerCatchError(retires - 1);
        } else {
          console.log(`Many retries not working, stopping. Please check API keys valid!`);
        }
      }
    });
  }

  fetchDataLocal() {
    this.data = overviewData;
    this.formatData();
    console.log("Data available:");
    console.log("-------------");
    console.log(this.data);
    console.log("-------------");
  }

  onDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
