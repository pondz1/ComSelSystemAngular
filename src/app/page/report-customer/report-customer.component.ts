import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ProductBuy, ProductBuyItem} from "../buy/buy.component";
import {CustomerValue} from "../customer/customer.component";
import {CdkAccordionItem} from "@angular/cdk/accordion";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ProductBuyListComponent} from "../../BottomSheet/product-buy-list/product-buy-list.component";

@Component({
  selector: 'app-report-customer',
  templateUrl: './report-customer.component.html',
  styleUrls: ['./report-customer.component.css']
})
export class ReportCustomerComponent implements OnInit {
  customerReports: CustomerReport[] = [];
  dataSourceProductBuy: any = new MatTableDataSource<ProductBuy>();
  displayedColumnsProductBuy: string[] = ['productBuyID', 'date', 'sumPrice','action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchKey: string = '';
  sumPrice: number = 0

  constructor(private http: HttpClient, private dService: DataServiceService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInventoryReport()
  }

  toggleAccordionItem(accordionItem: CdkAccordionItem, index: number) {
    this.dataSourceProductBuy.data = this.customerReports[index].productBuys
    this.dataSourceProductBuy.paginator = this.paginator
    this.sumPrice = 0
    this.getSumPrice(this.customerReports[index].productBuys)
    accordionItem.toggle()
  }

  getInventoryReport(): void {
    this.http.get<ResCustomerReport>(this.dService.baseURI + '/api/Report/CustomerReport')
      .subscribe(value => {
        this.customerReports = value.data
        // console.log(value)
      }, error => {
        // console.log(error)
      })
  }

  onSearch(){
    if (this.searchKey == ''){
      this.getInventoryReport()
    } else {
      this.http.get<ResCustomerReport>(this.dService.baseURI + '/api/Report/CustomerReport/Search/' + this.searchKey)
        .subscribe(value => {
          this.customerReports = value.data
          // console.log(value)
        }, error => {
          // console.log(error)
        })
    }
  }

  onReset(){
    this.getInventoryReport()
  }

  toDate(value: ProductBuy) {
    // // console.log(value)
    const date = new Date(value.date * 1000);
    return date.getUTCDate() + '/' + (date.getMonth() + 1 )+ '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
  }

  getSumPrice(productBuys: ProductBuy[]): void{
    // console.log('sum')
    productBuys.map(value => {
      this.sumPrice += value.sumPrice
    })
  }

  openDialog(productList: ProductBuy[]): void {
    // // console.log(productList)
    const dialogRef = this.dialog.open(ProductBuyListComponent, {
      width: '1000px',
      data: {productBuyItems: productList},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}

interface ResCustomerReport {
  message: string
  data: CustomerReport[]
}

interface CustomerReport {
  customer: CustomerValue
  productBuys: ProductBuy[]
}
