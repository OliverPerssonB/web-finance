import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YahooHttpService {
  yahooUrl = "https://yfapi.net"
  apiKeys = {
    oli: "QMzocjYt7553Y395S5Z0B5yTfjromREd6N4Ua7ce",
    pat: "jzdoOBxZgw9xCkHYCjA17VN1kOUXFdZ6CVYAUo7e",
    sig: "IiPM1JQtAa7c9WuLwlUsu5u5nsqJo8tDNZZvR0k2",
    nic: "KHtNBll61I2jhMgMaL9Xl5fASrbQ90eBV3sYGrxc",
  }

  constructor(private http: HttpClient) { }


  getMarketSummary() {
    let url = this.yahooUrl + "/v6/finance/quote/marketSummary";
    let header = new HttpHeaders();
    header = header.append("X-API-KEY", this.apiKeys.oli);
    let params = new HttpParams();
    params = params.append("lang", "en")
    params = params.append("region", "GB")
    console.log("sending http");
    return this.http.get(url, { headers: header, params: params });
  }

  getStock() {
    let url = this.yahooUrl + "/v8/finance/spark";
    let header = new HttpHeaders();
    header = header.append("X-API-KEY", this.apiKeys.oli);
    let params = new HttpParams();
    params = params.append("interval", "1d");
    params = params.append("range", "1mo");
    params = params.append("symbols", "AAPL");
    return this.http.get(url, { headers: header, params: params });
  }
}
