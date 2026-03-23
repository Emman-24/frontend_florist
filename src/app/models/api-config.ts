import {HttpHeaders, HttpParams } from "@angular/common/http";

export interface ApiConfig {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}
