import { Component, OnInit } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pick-stocks',
  templateUrl: './pick-stocks.component.html',
  styleUrls: ['./pick-stocks.component.css']
})
export class PickStocksComponent implements OnInit {
  private subscription: any;
  private data: any;

  form: FormGroup;

  public availableStocks =
    [ 'AAPL'
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

  public selectedStocks = [this.availableStocks[0]];

  constructor(private server: YahooHttpService, private fb: FormBuilder) {
    this.form = this.fb.group({
      checkArray: this.fb.array(['AAPL'])
    })
  }

  toggleStock(symbol: string) {
    if (this.selectedStocks.includes(symbol)) {
      this.selectedStocks = this.selectedStocks.filter( x => x !== symbol);
    } else {
      this.selectedStocks.push(symbol);
    }
    console.log(this.selectedStocks);
  }

  submitForm() {
    console.log(this.form.value);
  }

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
