import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { FormData } from './formdata';

@Injectable({
    providedIn: 'root'
})
export class YahooHttpService {
    private yahooUrl = "https://yfapi.net"
    private yahooSummaryUrl = this.yahooUrl + "/v6/finance/quote/marketSummary";
    private yahooStockUrl = this.yahooUrl + "/v8/finance/spark";
    private apiKeys = [
        "cfZAuq3fKQ79MeT5RXSJJ5wsbTQg8BLDaTrITqfg",
        "ouR0FBmXTq8t7Kr0h5eDb7rZkRCToj7V3Z9gsrAE",
        "eApQZNcUV09u8SjYaoWRLapE32iVOIRybn4WZVu1",
    ]

    constructor(private http: HttpClient) { }


    getMarketSummary() {
        let url = this.yahooUrl + "/v6/finance/quote/marketSummary";
        let header = new HttpHeaders();
        header = header.append("X-API-KEY", this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]);
        let params = new HttpParams();
        params = params.append("lang", "en")
        params = params.append("region", "GB")
        console.log("sending http");
        return this.http.get(url, { headers: header, params: params });
    }

    getStock(formData: FormData | undefined = undefined) {
        if (formData?.symbol && formData?.range && formData?.interval) {
            let header = new HttpHeaders();
            header = header.append("X-API-KEY", this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]);
            let params = new HttpParams();
            params = params.append("interval", formData!.interval);
            params = params.append("range", formData!.range);
            params = params.append("symbols", formData!.symbol);
            return this.http.get(this.yahooStockUrl, { headers: header, params: params });
        } else {
            return this.getDefaultAppleStock();
        }
    }

    private getDefaultAppleStock() {
        let header = new HttpHeaders();
        header = header.append("X-API-KEY", this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]);
        let params = new HttpParams();
        params = params.append("interval", "1d");
        params = params.append("range", "1mo");
        params = params.append("symbols", "AAPL");
        return this.http.get(this.yahooStockUrl, { headers: header, params: params });
    }
}
