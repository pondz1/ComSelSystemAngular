import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkAccordionItem} from "@angular/cdk/accordion";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ValueDataType} from "../product-type/product-type.component";
import {ValueDataProduct} from "../product/product.component";
import {ProductBuy, ProductBuyItem} from "../buy/buy.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-report-sales-revenue',
  templateUrl: './report-sales-revenue.component.html',
  styleUrls: ['./report-sales-revenue.component.css']
})
export class ReportSalesRevenueComponent implements OnInit {

  salesRevenue: SalesRevenue[] = []
  dataSourceProduct: any = new MatTableDataSource<SalesRevenue>();
  displayedColumnsProduct: string[] = ['proImage','productId', 'proName','date','proAmount','proPrice'];
  sumPrice: any = 0;
  sumAmount: any = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dService: DataServiceService) { }

  ngOnInit(): void {
    this.getSalesRevenue()
  }

  toggleAccordionItem(accordionItem: CdkAccordionItem, index: number) {
    accordionItem.toggle()
    this.dataSourceProduct.data = this.salesRevenue[index].productBuys
    this.dataSourceProduct.paginator = this.paginator
    this.sumPrice = this.salesRevenue[index].productBuys.reduce((sum,currentValue) =>  sum + (currentValue.buyCurrentPrice * currentValue.buyAmount), 0)
    this.sumAmount = this.salesRevenue[index].productBuys.reduce((sum,currentValue) =>  sum + currentValue.buyAmount, 0)
    // this.sumPrice = this.salesRevenue[index].productBuys.reduce((_,currentValue) => currentValue.buyAmount * currentValue.buyCurrentPrice, 0)
  }

  getSalesRevenue(): void {
    this.http.get<ResSalesRevenue>(this.dService.baseURI + '/api/Report/SalesRevenue')
      .subscribe(value => {
        console.log(value)
        this.salesRevenue = value.data
      }, error => {
        // console.log(error)
      })
  }

  public createImgPath = (serverPath: string) => {
    if (serverPath == null) {
      return '/assets/upload-1.png'
    } else {
      return `${this.dService.baseURI}/${serverPath}`;
    }
  }


  toDate(value: ProductBuy) {
    // // console.log(value)
    const date = new Date(value.date * 1000);
    return date.getUTCDate() + '/' + (date.getMonth() + 1 )+ '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
  }

}

interface ResSalesRevenue {
  message: string
  data: SalesRevenue[]
}

interface SalesRevenue {
  productType: ValueDataType
  productBuys: ProductBuyItem[]
}
