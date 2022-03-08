import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormData } from '../formdata';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-pick-stocks',
  templateUrl: './pick-stocks.component.html',
  styleUrls: ['./pick-stocks.component.css']
})
export class PickStocksComponent implements OnInit {
  @Output() newStockEvent = new EventEmitter();
  private subscription: any;
  private data: any;

  public presetSymbols =
    ['AAPL'
      , 'AMZN'
      , 'AZN'
      , 'BIGC'
      , 'DKNG'
      , 'DPHC'
      , 'FCX'
      , 'GME'
      , 'GOOG'
      , 'IBIO'
      , 'ITCI'
      , 'JCPNQ'
      , 'LAKE'
      , 'LCA'
      , 'MSFT'
      , 'NCNO'
      , 'OTRK'
      , 'PRPO'
      , 'RH'
      , 'SLQT'
      , 'TIF'
      , 'TRIL'
      , 'WKHS'
      , 'ZS'
    ];


  public presetIntervals =
    ['1m'
      , '5m'
      , '15m'
      , '1d'
      , '1wk'
      , '1mo'
    ]

  public presetRanges =
    ['1d'
      , '5d'
      , '1mo'
      , '3mo'
      , '6mo'
      , '1y'
      , '5y'
      , 'max'
    ]

  model = new FormData(this.presetSymbols[0], this.presetRanges[0], this.presetIntervals[0]);

  constructor(private server: YahooHttpService) {
  }

  onSubmit(retires = 10) {
    const stockData = this.server.getStock(this.model);
    this.subscription = stockData.subscribe({
      next: (obj) => {
        console.log("Received data from server:");
        console.log("--------");
        console.log(obj);
        // @ts-ignore
        if (obj.spark) {
          alert("Stock " + this.model.symbol + " not found");
        } else {
          this.newStockEvent.emit(obj)
        }
        console.log("--------");
      },
      error: (err) => {
        if (retires > 0) {
          console.log(`Error when sending HTTP, trying again! Retry left: ${retires}`);
          this.onSubmit(retires - 1);
        } else {
          console.log(`Many retries not working, stopping. Please check API keys valid!`);
          this.newStockEvent.emit(this.data);
        }
      }

    })
  }


  ngOnInit(): void {
    this.data = stockDataApple;
    // console.log("Data available:");
    // console.log("-------------");
    // console.log(this.data);
    // console.log("-------------");
  }

  onDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
