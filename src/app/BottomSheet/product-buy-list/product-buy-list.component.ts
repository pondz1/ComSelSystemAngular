import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ProductBuyItem} from "../../page/buy/buy.component";

@Component({
  selector: 'app-product-buy-list',
  templateUrl: './product-buy-list.component.html',
  styleUrls: ['./product-buy-list.component.css']
})
export class ProductBuyListComponent implements OnInit {

  productBuyItems: ProductBuyItem[] = []
  sumPrice: number = 0
  constructor(
    public dialogRef: MatDialogRef<ProductBuyListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productBuyItems: ProductBuyItem[]},
    private http: HttpClient,
    private dService: DataServiceService,
  ) {
    this.productBuyItems = data.productBuyItems
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  ngOnInit(): void {
    // this.getProductBuyItems()
    this.sumPrice = this.productBuyItems.reduce((_,currentValue) => currentValue.buyAmount * currentValue.buyCurrentPrice, 0)
  }

  // getProductBuyItems() {
  //   this.http.get<ResProductBuyItem>(this.dService.baseURI + '/api/Report/ProductBuyItems/' + this.data.productBuyID)
  //     .subscribe(value => {
  //       // this.customerReports = value.data
  //       this.productBuyItems = value.data
  //       this.sumPrice = value.data.reduce((_,currentValue) => currentValue.buyAmount * currentValue.buyCurrentPrice, 0)
  //       console.log(value)
  //     }, error => {
  //       console.log(error)
  //     })
  // }

}

interface ResProductBuyItem {
  message: string
  data: ProductBuyItem[]
}
