import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ValueDataProduct} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ValueDataType} from "../product-type/product-type.component";
import {CustomerValue} from "../customer/customer.component";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  test: string = '';
  products: ValueDataProduct[] = []
  allProducts: ValueDataProduct[] = []
  amounts: number[] = []
  searchText: any;
  productTypes: ValueDataType[] = [];
  selectFormControl = new FormControl(-1,);
  productBuy?: ProductBuy
  customerList: CustomerValue[] = [];
  customerListClone: CustomerValue[] = [];
  sumPrice: number = 0

  @ViewChild('f') public readonly form!: NgForm
  @ViewChild('created') public readonly creactedSwal!: SwalComponent;

  constructor(private http: HttpClient, private dService: DataServiceService) {
  }

  ngOnInit(): void {
    this.getProducts()
    this.getTypes()
    this.getCustomers()
  }

  selectedType: any;
  customerTextSearch: string = '';
  selectCustomerFormControl = new FormControl('', Validators.required);
  selectedCustomer: any;


  private _filterCustomerValue(value: string): CustomerValue[] {
    const filterValue = value.toLowerCase();
    return this.customerList.filter(customer => customer.cusFirstName.toLowerCase().includes(filterValue));
  }

  getProducts(): void {
    this.http.get<ResDataProduct>(this.dService.baseURI + '/api/Product/Get/' + 'normal' + '/all', {headers: this.dService.headers})
      .subscribe(value => {
        // console.log(value)
        // console.log(this.products)
        // const difference = value.data.filter(a => !this.products.map(b => b.productId).includes(a.productId))
        this.allProducts = value.data
      }, error => {
        console.log(error)
      })
  }

  getTypes(): void {
    this.http.get<ResDataType>(this.dService.baseURI + '/api/ProductType', {headers: this.dService.headers})
      .subscribe(value => {
        // console.log(value)
        this.productTypes = value.data
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
  }

  getList(size: number) {
    let array: any[] = []
    for (let i = 0; i < size; i++) {
      array.push({name: i + 1, value: i + 1})
    }
    return array
  }

  onSearch() {
    let body = {
      productType: this.selectedType ?? -1,
      keyword: this.searchText ?? ""
    }
    console.log(body)
    this.http.post<ResDataProduct>(this.dService.baseURI + '/api/Product/Search', body, {headers: this.dService.headers})
      .subscribe(value => {
        this.allProducts = value.data
      }, error => {
        console.log(error)
      })
  }

  onInsert(f: NgForm) {
    console.log(this.selectCustomerFormControl.valid)
    if (this.selectCustomerFormControl.valid && (this.products.length > 0)) {
      let body = {
        productBuyID: 0,
        customerID: this.selectCustomerFormControl.value,
        productList: this.products.map((value, index) => {
          return {
            buyItemID: 0,
            productId: value.productId,
            product: value,
            buyAmount: this.amounts[index],
            buyCurrentPrice: value.proPrice,
          }
        }),
        coupon: 0,
        date: new Date().getTime() / 1000
      }

      console.log(body)
      this.http.post(this.dService.baseURI + '/api/ProductBuy/Insert', body, {headers: this.dService.headers})
        .subscribe(value => {
          console.log(value)
          this.creactedSwal.fire()
        })
    }
  }

  getCustomers(): void {
    this.http.get<ResDataCustomer>(this.dService.baseURI + '/api/Customer')
      .subscribe(value => {
        this.customerList = value.data
        this.customerListClone = value.data
      }, error => {
        console.log(error)
      })
  }


  onFilter(event: Event) {
    // console.log(event)
    this.customerList = this._filterCustomerValue(this.customerTextSearch)
    if (this.customerTextSearch == '') {
      this.customerList = this.customerListClone.slice()
    }
  }

  onSuccess() {
    this.form.resetForm()
    this.selectCustomerFormControl.reset()
    this.getProducts()
    this.products = []
  }
  getSumPrice(): number {
    let sum = 0
    this.products.forEach((value, index) => {
      sum += value.proPrice * this.amounts[index]
    })
    return sum
  }

  onDiscount() {
    let sumPrice = this.getSumPrice()
    this.sumPrice = sumPrice - sumPrice * this.form.value.coupon / 100
  }
}

interface ResDataProduct {
  message: string
  data: ValueDataProduct[]
}

interface ResDataType {
  message: string
  data: ValueDataType[]
}

export interface ProductBuy {
  productBuyID: number,
  customerID: number,
  customer?: CustomerValue,
  productList: ProductBuyItem[],
  coupon: number,
  date: number
}

export interface ProductBuyItem {
  buyItemID: number,
  productId: number,
  product?: ValueDataProduct,
  buyAmount: number,
  buyCurrentPrice: number,
  productBuyID: number
}

interface ResDataCustomer {
  message: string
  data: CustomerValue[]
}
