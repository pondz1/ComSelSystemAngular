import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ProductSet, ProGroup} from "../product-set/product-set.component";
import {MatPaginator} from "@angular/material/paginator";
import {ValueDataProduct} from "../product/product.component";

@Component({
  selector: 'app-product-set-list',
  templateUrl: './product-set-list.component.html',
  styleUrls: ['./product-set-list.component.css']
})
export class ProductSetListComponent implements OnInit {

  dataSource = new MatTableDataSource<ProductSet>();
  displayProductSet: any = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['productId', 'proName', 'proAmount', 'proPrice'];

  dataProGroup: ProGroup[] = [];
  private PGId: any;
  // columnsToDisplay: string[] = ['productId', 'proName','proPrice'];
  sumPrice: number = 0;
  private openIndex: number = 0;

  constructor(private http: HttpClient, private dService: DataServiceService) {
    console.log('test')
  }

  ngOnInit(): void {
    this.getProGroup()
  }

  getProGroup(): void {
    this.http.get<ResProGroup>(this.dService.baseURI + '/api/ProGroup', {headers: this.dService.headers})
      .subscribe(value => {
        console.log(value.data)
        this.dataProGroup = value.data
      }, error => {
        console.log(error)
      })
  }

  getProductSet(): void {
    this.http.get<ResProSet>(this.dService.baseURI + '/api/ProductSet/' + this.PGId, {headers: this.dService.headers})
      .subscribe(value => {
        console.log(value.data)
        this.dataSource.data = value.data
        this.dataSource.paginator = this.paginator
        this.sumPrice = this.getSumPrice(value.data)
      }, error => {
        console.log(error)
      })
  }

  onOpen(item: ProGroup, index: number) {
    // console.log(item)
    this.openIndex = index
    this.PGId = item.pgid
    this.getProductSet()
  }

  setDisplayProduct(b: boolean) {
    this.displayProductSet = b;
  }

  getSumPrice(productSet: ProductSet[]): number {
    let sum = 0
    productSet.forEach((value, index) => {
      sum += value.product.proPrice * value.productAmount
    })
    return sum
  }

}

interface ResProGroup {
  message: string,
  data: ProGroup[]
}

interface ResProSet {
  message: string,
  data: ProductSet[]
}
