import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  baseURI = 'https://localhost:44317/api';
  headers = new HttpHeaders();

  constructor() {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }
}
