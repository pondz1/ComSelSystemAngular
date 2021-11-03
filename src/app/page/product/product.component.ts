import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ValueDataType} from "../product-type/product-type.component";
import {HttpClient, HttpEventType} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl, NgForm, Validators} from "@angular/forms";
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  displayedColumns: string[] = ['proImage', 'productId', 'proName', 'proAmount',
    'proPrice', 'proType', 'proBrand', 'proModel', 'proDetail', 'action'];
  dataSource = new MatTableDataSource<ValueDataProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayProduct: boolean = true;
  progress: number = 0;
  dbPath: DbPath | undefined;
  productTypes: ValueDataType[] = []
  selectedType: any;

  @ViewChild('created')
  public readonly creactedSwal!: SwalComponent;

  @ViewChild('updated')
  public readonly updatedSwal!: SwalComponent;

  @ViewChild('errored')
  public readonly erroredSwal!: SwalComponent;

  selectFormControl = new FormControl('', Validators.required);
  productEdit: ValueDataProduct | undefined;
  isEdit: boolean = false
  searchPath: string = 'normal'
  searchText: any;
  searchKey: string = '/all';

  constructor(private http: HttpClient, private dataSer: DataServiceService,) {
    this.dataSource.filterPredicate =
      (data: ValueDataProduct, filter: string) => data.proName.indexOf(filter) != -1;
  }

  ngOnInit(): void {
    if (this.displayProduct) {
      this.getProducts()
    } else {
      this.getTypes()
    }
  }

  setDisplayProduct(value: boolean): void {
    if (!value) {
      this.getTypes()
    } else {
      this.productEdit = undefined
      this.selectFormControl.setValue(undefined)
      this.selectedType = undefined
      this.isEdit = false
      this.dbPath = undefined
      this.progress = 0
      this.getProducts()
    }
    this.displayProduct = value
  }

  getProducts(): void {
    this.http.get<ResData>(this.dataSer.baseURI + '/api/Product/Get/' + this.searchPath + this.searchKey, {headers: this.dataSer.headers})
      .subscribe(value => {
        console.log(value)
        this.dataSource = new MatTableDataSource<ValueDataProduct>(value.data);
        this.dataSource.paginator = this.paginator;
      }, error => {
        console.log(error)
      })
  }

  getTypes(): void {
    this.http.get<ResDataType>(this.dataSer.baseURI + '/api/ProductType', {headers: this.dataSer.headers})
      .subscribe(value => {
        // console.log(value)
        this.productTypes = value.data
        if (this.isEdit) {
          this.selectFormControl.setValue(this.productEdit?.typeId)
          this.selectedType = this.productEdit?.typeId
        }
      }, error => {
        console.log(error)
      })
  }

  insert(f: NgForm) {
    if (f.valid && this.selectFormControl.valid) {
      let body = {
        productId: this.productEdit?.productId,
        proBrand: f.value.brand.trim(),
        proImage: this.dbPath?.dbPath,
        proName: f.value.name.trim(),
        typeId: this.selectedType,
        proDetail: f.value.detail.trim(),
        proPrice: f.value.price,
        proModel: f.value.model.trim(),
        proAmount: f.value.amount
      }
      // console.log(body)
      if (this.isEdit) {
        this.http.put(this.dataSer.baseURI + '/api/Product/Update', body, {headers: this.dataSer.headers})
          .subscribe(value => {
            if (typeof value !== undefined) {
              this.updatedSwal.fire()
            }
          }, error => {
            // console.log(error)
            this.erroredSwal.title = 'Error code status ' + error.status
            this.erroredSwal.fire()
          })

      } else {
        this.http.post(this.dataSer.baseURI + '/api/Product/Insert', body, {headers: this.dataSer.headers})
          .subscribe(value => {
              if (typeof value !== undefined) {
                f.resetForm()
                this.creactedSwal.fire()
              }
            }, error => {
              console.log(error.status)
              console.log(error.message)
              this.erroredSwal.title = 'Error code status ' + error.status
              this.erroredSwal.fire()
            }
          )
      }
    }
  }

  public createImgPath = (serverPath: string) => {
    if (serverPath == null) {
      return '/assets/upload-1.png'
    } else {
      return `${this.dataSer.baseURI}/${serverPath}`;
    }
  }

  uploadFile(files: FileList) {
    if (files.length === 0) {
      return;
    }
    if (files[0]) {
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      this.http.post(this.dataSer.baseURI + '/api/Upload', formData, {reportProgress: true, observe: 'events'})
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
            console.log(event.body)
            this.dbPath = event.body as DbPath;
            // this.onUploadFinished.emit(event.body);
          }
        });
    }
  }

  setDisplayUpdate(b: boolean, isEdit: boolean, element: ValueDataProduct) {
    if (isEdit) {
      this.isEdit = isEdit;
      this.dbPath = {
        dbPath: element.proImage
      }
      console.log(this.dbPath)
      this.productEdit = element
    }
    this.setDisplayProduct(b)
  }

  deleteProduct(element: ValueDataProduct) {
    this.http.delete(this.dataSer.baseURI + '/api/Product/' + element.productId.toString())
      .subscribe(value => {
        if (value) {
          this.getProducts()
        }
      }, error => {
        this.erroredSwal.title = error.message + ' ' + error.status
        this.erroredSwal.fire()
      })
  }

  setSearch(element: ValueDataProduct) {
    // console.log(element)
    this.searchPath = 'type'
    this.searchKey = '/' + element.typeId.toString()
    this.getProducts()
  }

  resetSearch(): void {
    this.searchPath = 'normal'
    this.searchText = ''
    this.searchKey = '/all'
    this.getProducts()
  }

  onSearch() {
    this.searchPath = 'normal'
    this.searchKey = '/' + this.searchText
    this.getProducts()
  }

  // applyFilter(filterValue: Event) {
  //   console.log(this.searchText)
  //   this.searchText = this.searchText.trim(); // Remove whitespace
  //   // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   this.dataSource.filter = this.searchText;
  // }


}

interface ResData {
  message: string
  data: ValueDataProduct[]
}

interface ResDataType {
  message: string
  data: ValueDataType[]
}

export interface ValueDataProduct {
  productId: number,
  proName: string,
  proPrice: number,
  typeId: number,
  proType: ValueDataType
  proBrand: string,
  proModel: string,
  proDetail: string,
  proImage: string,
  proAmount: number
}

export interface DbPath {
  dbPath: string
}
