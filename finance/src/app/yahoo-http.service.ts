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
    "QMzocjYt7553Y395S5Z0B5yTfjromREd6N4Ua7ce",
    "jzdoOBxZgw9xCkHYCjA17VN1kOUXFdZ6CVYAUo7e",
    "IiPM1JQtAa7c9WuLwlUsu5u5nsqJo8tDNZZvR0k2",
    "KHtNBll61I2jhMgMaL9Xl5fASrbQ90eBV3sYGrxc",
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

  getStock(formatData: FormData = undefined) {
    if (formatData.symbol && formatData.range && formatData.interval) {
      let header = new HttpHeaders();
      header = header.append("X-API-KEY", this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]);
      let params = new HttpParams();
      params = params.append("interval", formatData.interval);
      params = params.append("range", formatData.range);
      params = params.append("symbols", formatData.symbol);
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
