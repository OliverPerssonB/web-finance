import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormData } from '../formdata';

@Component({
    selector: 'app-pick-stocks',
    templateUrl: './pick-stocks.component.html',
    styleUrls: ['./pick-stocks.component.css']
})
export class PickStocksComponent implements OnInit {
    @Output() newStockEvent = new EventEmitter()
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

    onSubmit() {
        const stockData = this.server.getStock(this.model);
        this.subscription = stockData.subscribe(obj => {
            console.log("Received data from server:");
            console.log("--------");
            console.log(obj);
            console.log(typeof (obj))
            // @ts-ignore
            if (obj.spark) {
                alert("Stock " + this.model.symbol + " not found");
            } else {
                this.newStockEvent.emit(obj)
            }
            console.log("--------");
        });
    }

    ngOnInit(): void {
        this.data = stockDataApple;
        // console.log("Data available:");
        // console.log("-------------");
        // console.log(this.data);
        // console.log("-------------");
    }

    fetchData() {
        let data = this.server.getStock(this.model);
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
