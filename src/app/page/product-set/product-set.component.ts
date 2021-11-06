import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ValueDataProduct} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {NgForm} from "@angular/forms";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {Observable} from "rxjs";

@Component({
  selector: 'app-product-set',
  templateUrl: './product-set.component.html',
  styleUrls: ['./product-set.component.css']
})
export class ProductSetComponent implements OnInit {

  products: ValueDataProduct[] = []
  allProducts: ValueDataProduct[] = []
  allProductsClone: ValueDataProduct[] = []
  amounts: number[] = []
  @ViewChild('created')
  public readonly creactedSwal!: SwalComponent;

  @ViewChild('updated')
  public readonly updatedSwal!: SwalComponent;

  @ViewChild('errored')
  public readonly erroredSwal!: SwalComponent;


  @Output() public setDisplayProductSet: EventEmitter<any> = new EventEmitter();
  // @Output() public getProGroup: EventEmitter<any> = new EventEmitter();
  @Input() public productGroup?: ProGroup
  @Input() public productSets?: ProductSet[]

  constructor(private http: HttpClient, private dService: DataServiceService) {
    // // console.log('add')
  }

  ngOnInit(): void {
    this.getProducts()
    if (this.productGroup) {
      // console.log(this.productGroup)
    }
  }

  searchText: any = '';

  // priceFormControl: any = new FormControl(0, Validators.required);

  getProducts(): void {
    this.http.get<ResDataProduct>(this.dService.baseURI + '/api/Product/Get/' + 'normal' + '/all', {headers: this.dService.headers})
      .subscribe(value => {
        // // console.log(value)
        // // console.log(this.products)
        if (typeof this.productSets != undefined) {
          this.productSets?.map((value, index) => {
            this.amounts[index] = value.productAmount
            this.products.push(value.product)
          })
        }
        const difference = value.data.filter(a => !this.products.map(b => b.productId).includes(a.productId))
        this.allProducts = difference
        this.allProductsClone = difference
      }, error => {
        // console.log(error)
      })
  }

  drop(event: CdkDragDrop<ValueDataProduct[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.amounts = this.products.map(value => 1)
    // // console.log(this.products)
    // // console.log(this.amounts)
  }

  private _filter(value: string): ValueDataProduct[] {
    const filterValue = value.toLowerCase();

    return this.allProducts.filter(product => product.proName.toLowerCase().includes(filterValue));
  }

  onChange(event: Event) {
    // // console.log(this.searchText)
    this.allProducts = this._filter(this.searchText)
    if (this.searchText == '') {
      this.allProducts = this.allProductsClone.slice()
    }
  }

  getList(size: number) {
    let array: any[] = []
    for (let i = 0; i < size; i++) {
      array.push({name: i + 1, value: i + 1})
    }
    return array
  }

  onChangeSelect(event: Event) {
    // // console.log(event)
    // // console.log(this.amounts)
  }

  onInsert(f: NgForm) {

    if (f.valid && this.products.length > 0) {
      // // console.log(this.productGroup)
      let body = {
        pgid: this.productGroup?.pgid,
        pgName: f.value.nameSet,
        pgPrice: f.value.price,
        pgStatus: false,
        products: this.products.map((value, index) => {
          return {
            // setId: this.productSets[index].setId,
            productId: value.productId,
            productAmount: this.amounts[index],
            pgid: this.productGroup?.pgid,
          }
        })
      }

      // console.log(body)
      // // console.log(this.amounts)
      if (this.productGroup != undefined) {
        this.deleteOldProSet().subscribe(value => {
          this.http.put(this.dService.baseURI + '/api/ProGroup/Update', body, {headers: this.dService.headers})
            .subscribe(value => {
              if (typeof value != undefined) {
                // this.getProGroup()
                // console.log(value)
                this.updatedSwal.fire()
                // this.goBack()
              }
            }, error => {
              // console.log(error)
              this.erroredSwal.title = 'Error code status ' + error.status
              this.erroredSwal.fire()
            })
        })
      } else {
        this.http.post(this.dService.baseURI + '/api/ProGroup/Insert', body, {headers: this.dService.headers})
          .subscribe(value => {
            // console.log(value)
            if (typeof value != undefined) {
              this.creactedSwal.fire()
              f.resetForm()
              this.products = []
              this.allProducts = this.allProductsClone.slice()
            }
          }, error => {
            this.erroredSwal.title = 'Error code status ' + error.status
            this.erroredSwal.fire()
          })
      }
    }
  }

  deleteOldProSet(): Observable<Object> {
    let body = {
      proSetID: this.productSets?.map(value => value.setId)
    }
    return this.http.delete(this.dService.baseURI + '/api/ProductSet/List', {headers: this.dService.headers, body: body})
  }

  sumPrice(): number {
    let sum = 0
    this.products.forEach((value, index) => {
      sum += value.proPrice * this.amounts[index]
    })
    return sum
  }

  onSuccess() {
    this.allProducts = this.allProductsClone.slice()
    this.getProducts()
  }

  goBack() {
    this.setDisplayProductSet.emit({value: true})
    this.products = []
    // this.getProGroup.emit()
  }
}

interface ResDataProduct {
  message: string
  data: ValueDataProduct[]
}

export interface ProGroup {
  pgid: number,
  pgName: string,
  pgPrice: number,
  pgStatus: boolean,
  products: ProductSet[]

}

export interface ProductSet {
  setId: number,
  productId: number,
  productAmount: number,
  pgid: number,
  product: ValueDataProduct
}
