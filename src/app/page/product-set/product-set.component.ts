import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ValueDataProduct} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {NgForm} from "@angular/forms";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

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

  @Output() public setDisplayProductSet: EventEmitter<any> = new EventEmitter();
  @Output() public getProGroup: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private dService: DataServiceService) {

  }

  ngOnInit(): void {
    this.getProducts()
  }

  searchText: any = '';
  // priceFormControl: any = new FormControl(0, Validators.required);

  getProducts(): void {
    this.http.get<ResDataProduct>(this.dService.baseURI + '/api/Product/Get/' + 'normal' + '/all', {headers: this.dService.headers})
      .subscribe(value => {
        // console.log(value)
        this.allProducts = value.data
        this.allProductsClone = value.data
      }, error => {
        console.log(error)
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
    // console.log(this.products)
    // console.log(this.amounts)
  }

  private _filter(value: string): ValueDataProduct[] {
    const filterValue = value.toLowerCase();

    return this.allProducts.filter(product => product.proName.toLowerCase().includes(filterValue));
  }

  onChange(event: Event) {
    // console.log(this.searchText)
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
    // console.log(event)
    // console.log(this.amounts)
  }

  onInsert(f: NgForm) {

    if (f.valid && this.products.length > 0){

      let body = {
        pgid: 0,
        pgName: f.value.nameSet,
        pgPrice: f.value.price,
        pgStatus: false,
        products: this.products.map((value, index) => {
          return {
            setId: 0,
            productId: value.productId,
            productAmount: this.amounts[index]
          }
        })
      }
      this.http.post(this.dService.baseURI + '/api/ProGroup/Insert', body, {headers: this.dService.headers})
        .subscribe(value => {
          console.log(value)
          if (typeof value != undefined){
            this.creactedSwal.fire()
            f.resetForm()
            this.products = []
            this.allProducts = this.allProductsClone.slice()
          }
        })
      // console.log(body)
      // console.log(this.amounts)

    }
  }

  sumPrice(): number {
    let sum = 0
    this.products.forEach((value,index) => {
      sum += value.proPrice * this.amounts[index]
    })
    return sum
  }

  onSuccess() {
    this.allProducts = this.allProductsClone.slice()
    this.getProducts()
  }

  goBack() {
    this.getProGroup.emit()
    this.setDisplayProductSet.emit()
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
