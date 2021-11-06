import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductSet, ProGroup} from "../../page/product-set/product-set.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValueDataProduct} from "../../page/product/product.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-bottom-sheet-set',
  templateUrl: './bottom-sheet-set.component.html',
  styleUrls: ['./bottom-sheet-set.component.css']
})
export class BottomSheetSetComponent implements OnInit {

  proGroups: ProGroup[] = []
  dataSource = new MatTableDataSource<ProductSet>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productSets?: ProductSet[];
  sumPrice: number = 0;
  // PGID?: number;
  displayedColumns: string[] = ['proName', 'proAmount', 'proPrice'];

  constructor(private http: HttpClient, private dService: DataServiceService,public dialogRef: MatDialogRef<BottomSheetSetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
    this.getProGroup()
  }

  getSumPrice(productSet: ProductSet[]): number {
    let sum = 0
    productSet.forEach((value, index) => {
      sum += value.product.proPrice * value.productAmount
    })
    return sum
  }

  getProGroup(): void {
    this.http.get<ResProGroup>(this.dService.baseURI + '/api/ProGroup/Approve', {headers: this.dService.headers})
      .subscribe(value => {
        // // console.log(value.data)
        this.proGroups = value.data
        // this.dataProGroup = value.data
        // this.dataProGroupClone = value.data
      }, error => {
        // console.log(error)
      })
  }

  getProductSet(PGId: number): void {
    this.http.get<ResProSet>(this.dService.baseURI + '/api/ProductSet/' + PGId, {headers: this.dService.headers})
      .subscribe(value => {
        // console.log(value.data)
        this.dataSource.data = value.data
        this.dataSource.paginator = this.paginator
        this.productSets = value.data
        // this.data.
        value.data.map((value1, index) => {
          this.data.products.push(value1.product)
          this.data.amounts[index] = value1.productAmount
        })
        // this.sumPrice = this.getSumPrice(value.data)
      }, error => {
        // console.log(error)
      })
  }

  onNoClick(): void {

    // this.data.isProductImport = false
    this.dialogRef.close();
  }

  // onOkClick() {
  //   this.data.isProductImport = false
  //   this.dialogRef.close();
  // }
  onOpen(pgid: number, index: number) {

    this.data.isProductImport = true
    // console.log(this.data.isProductImport)
    this.data.sumPrice = this.proGroups[index].pgPrice
    // this.data.products = [].slice()
    this.getProductSet(pgid)
  }

  onClose() {
    this.data.isProductImport = false
    this.data.products = [].slice()
  }

  onOpened() {
    this.data.isProductImport = true
  }

  getData(){
    return this.data
  }

  onClosed() {
    this.data.isProductImport = false
    this.data.products = [].slice()
    this.data.amounts = [].slice()
    this.data.sumPrice = 0
  }
}
interface ResProGroup {
  message: string,
  data: ProGroup[]
}
export interface DialogData {
  isProductImport: boolean
  products: ValueDataProduct[]
  amounts: number[],
  sumPrice: number
}
interface ResProSet {
  message: string,
  data: ProductSet[]
}
