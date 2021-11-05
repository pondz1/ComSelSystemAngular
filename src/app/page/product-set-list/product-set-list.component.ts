import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ProductSet, ProGroup} from "../product-set/product-set.component";
import {MatPaginator} from "@angular/material/paginator";
import {ValueDataProduct} from "../product/product.component";
import {Observable} from "rxjs";

@Component({
  selector: 'app-product-set-list',
  templateUrl: './product-set-list.component.html',
  styleUrls: ['./product-set-list.component.css']
})
export class ProductSetListComponent implements OnInit {

  dataSource = new MatTableDataSource<ProductSet>();
  productSets?: ProductSet[];
  displayProductSet: any = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['productId', 'proName', 'proAmount', 'proPrice'];

  dataProGroup: ProGroup[] = [];
  productGroup?: ProGroup
  private PGId: any;
  // columnsToDisplay: string[] = ['productId', 'proName','proPrice'];
  sumPrice: number = 0;
  private openIndex: number = 0;
  dataProGroupClone: ProGroup[] = [];
  searchText: string = '';

  constructor(private http: HttpClient, private dService: DataServiceService) {
    // console.log('test')
  }

  ngOnInit(): void {
    this.getProGroup()
  }

  getProGroup(): void {
    this.http.get<ResProGroup>(this.dService.baseURI + '/api/ProGroup', {headers: this.dService.headers})
      .subscribe(value => {
        console.log(value.data)
        this.dataProGroup = value.data
        this.dataProGroupClone = value.data
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
        this.productSets = value.data
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
    if (!b) {
      this.productGroup = undefined
    } else {
      this.getProGroup()
      this.productSets = undefined
    }
    console.log(b)
    this.displayProductSet = b;
  }

  addButton(): void {
    this.productSets = undefined
    this.productGroup = undefined
    this.setDisplayProduct(false)
  }

  getSumPrice(productSet: ProductSet[]): number {
    let sum = 0
    productSet.forEach((value, index) => {
      sum += value.product.proPrice * value.productAmount
    })
    return sum
  }

  onChange(event: Event) {
    // console.log(this.searchText)
    this.dataProGroup = this._filter(this.searchText)
    if (this.searchText == '') {
      this.dataProGroup = this.dataProGroupClone.slice()
    }
  }

  private _filter(value: string): ProGroup[] {
    const filterValue = value.toLowerCase();

    return this.dataProGroup.filter(product => product.pgName.toLowerCase().includes(filterValue));
  }

  reset() {
    this.getProGroup()
  }

  toggleUpdateStatus(item: ProGroup): void {
    this.deleteOldProSet().subscribe(value => {
      let body = {
        pgid: item.pgid,
        pgName: item.pgName,
        pgPrice: item.pgPrice,
        pgStatus: !item.pgStatus,
        products: item.products
      }
      this.http.put(this.dService.baseURI + '/api/ProGroup/Update', body, {headers: this.dService.headers})
        .subscribe(value => {
          if (typeof value != undefined) {
            this.getProGroup()
          }
        })
    })
  }

  deleteOldProSet(): Observable<Object> {
    let body = {
      proSetID: this.productSets?.map(value => value.setId)
    }
    return this.http.delete(this.dService.baseURI + '/api/ProductSet/List', {
      headers: this.dService.headers,
      body: body
    })
  }

  displayUpdate(item: ProGroup) {
    this.productGroup = item
    this.displayProductSet = false
  }

  deleteProductGroup(item: ProGroup) {
    console.log(item.pgid)
    this.deleteOldProSet().subscribe(value => {
      this.http.delete(this.dService.baseURI + '/api/ProGroup/' + item.pgid, {headers: this.dService.headers})
        .subscribe(value1 => {
          this.getProGroup()
        })
    })
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
