import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ValueDataProduct} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {ValueDataType} from "../product-type/product-type.component";
import {CustomerValue} from "../customer/customer.component";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {BottomSheetSetComponent} from "../../BottomSheet/bottom-sheet-set/bottom-sheet-set.component";


export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 100,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults},],
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
  isProductImport = false

  @ViewChild('f') public readonly form!: NgForm
  @ViewChild('created') public readonly creactedSwal!: SwalComponent;
  @ViewChild('confirmSwal') public readonly confirmSwal!: SwalComponent;
  @ViewChild('errored') public readonly erroredSwal!: SwalComponent;

  constructor(private http: HttpClient, private dService: DataServiceService, public dialog: MatDialog) {
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
        // // console.log(value)
        // // console.log(this.products)
        // const difference = value.data.filter(a => !this.products.map(b => b.productId).includes(a.productId))
        this.allProducts = value.data
      }, error => {
        // console.log(error)
      })
  }

  getTypes(): void {
    this.http.get<ResDataType>(this.dService.baseURI + '/api/ProductType', {headers: this.dService.headers})
      .subscribe(value => {
        // // console.log(value)
        this.productTypes = value.data
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
    console.log(this.products)
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
    // console.log(body)
    this.http.post<ResDataProduct>(this.dService.baseURI + '/api/Product/Search', body, {headers: this.dService.headers})
      .subscribe(value => {
        this.allProducts = value.data
      }, error => {
        // console.log(error)
      })
  }

  onInsert(f: NgForm) {
    // console.log(this.selectCustomerFormControl.valid)
    let avgPriceSet = this.sumPrice / this.products.length
    if (this.selectCustomerFormControl.valid && (this.products.length > 0) && !this.checkAmount().includes(true)) {
      let body = {
        productBuyID: 0,
        customerID: this.selectCustomerFormControl.value,
        productList: this.products.map((value, index) => {
          return {
            buyItemID: 0,
            productId: value.productId,
            product: value,
            buyAmount: this.amounts[index],
            buyCurrentPrice: this.isProductImport ? avgPriceSet : value.proPrice,
            date: new Date().getTime() / 1000,
          }
        }),
        coupon: 0,
        date: new Date().getTime() / 1000,
        sumPrice: this.sumPrice
      }

      // console.log(body)
      this.http.post(this.dService.baseURI + '/api/ProductBuy/Insert', body, {headers: this.dService.headers})
        .subscribe(value => {
          // console.log(value)
          this.creactedSwal.fire()
        })
    }

    if (this.checkAmount().includes(true)) {
      this.erroredSwal.title = "product not enough"
      this.erroredSwal.fire()
    }
  }

  getCustomers(): void {
    this.http.get<ResDataCustomer>(this.dService.baseURI + '/api/Customer')
      .subscribe(value => {
        this.customerList = value.data
        this.customerListClone = value.data
      }, error => {
        // console.log(error)
      })
  }


  onFilter(event: Event) {
    // // console.log(event)
    this.customerList = this._filterCustomerValue(this.customerTextSearch)
    if (this.customerTextSearch == '') {
      this.customerList = this.customerListClone.slice()
    }
  }

  onSuccess() {
    this.form.resetForm()
    this.selectCustomerFormControl.reset()
    this.products = []
    this.sumPrice = 0
    this.isProductImport = false
    this.getProducts()

  }

  getSumPrice(): number {
    let sum = 0
    this.products.forEach((value, index) => {
      sum += value.proPrice * this.amounts[index]
    })
    if (!this.isProductImport) {
      this.sumPrice = sum
    }
    return sum
  }

  // onDiscount() {
  //   let sumPrice = this.getSumPrice()
  //   this.sumPrice = sumPrice - sumPrice * this.form.value.coupon / 100
  // }

  public createImgPath = (serverPath: string) => {
    if (serverPath == null) {
      return '/assets/upload-1.png'
    } else {
      return `${this.dService.baseURI}/${serverPath}`;
    }
  }

  confirmOrder() {
    if (this.selectCustomerFormControl.valid && (this.products.length > 0)) {
      this.confirmSwal.fire()
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BottomSheetSetComponent, {
      width: '650px',
      data: {
        isProductImport: false,
        products: [],
        amounts: [],
        sumPrice: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result) {
        // this.animal = result;
        console.log(result)
        this.isProductImport = result.isProductImport
        this.sumPrice = result.sumPrice
        this.products = result.products.slice()
        this.amounts = result.amounts.slice()
        if (!result.isProductImport) {
          this.products = []

          if (result.amounts.length > 0) {
            this.isProductImport = true
          } else {
            this.getProducts()
          }
          this.sumPrice = 0
          // // console.log('The dialog was closed' , 'if');
        }
      } else {
        this.isProductImport = false
        this.products = []
        this.getProducts()
        this.sumPrice = 0
      }
    });
  }

  reset() {
    this.isProductImport = false
    this.products = []
    this.amounts = []
    this.sumPrice = 0
    this.getProducts()
  }

  checkAmount() {
    return this.products.map((value, index) => {
      return value.proAmount < this.amounts[index]
    })
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
  productList?: ProductBuyItem[],
  coupon: number,
  date: number,
  sumPrice: number
}

export interface ProductBuyItem {
  buyItemID: number,
  productId: number,
  product?: ValueDataProduct,
  buyAmount: number,
  buyCurrentPrice: number,
  productBuyID: number,
  date: number
}

interface ResDataCustomer {
  message: string
  data: CustomerValue[]
}
