import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {Observable} from "rxjs";
import {NgForm} from "@angular/forms";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  displayCustomer: any = true;
  searchText: any;
  searchKey: any = '';
  dataSource: any = new MatTableDataSource<CustomerValue>();
  isEdit: boolean = false
  displayedColumns: string[] = ['customerID', 'cusFirstName',
    'cusAddress', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  customerEdit: CustomerValue | undefined

  @ViewChild('created')
  public readonly creactedSwal!: SwalComponent;

  @ViewChild('updated')
  public readonly updatedSwal!: SwalComponent;

  @ViewChild('errored')
  public readonly erroredSwal!: SwalComponent;

  constructor(private http: HttpClient, private dService: DataServiceService) {
  }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.getCustomers()
    }
  }

  getCustomers(): void {
    this.getResData()
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<CustomerValue>(value.data)
        this.dataSource.paginator = this.paginator;
      }, error => {
        console.log(error)
      })
  }

  getResData(): Observable<ResData> {
    if (this.searchKey == '') {
      return this.http.get<ResData>(this.dService.baseURI + '/api/Customer')
    } else {
      return this.http.get<ResData>(this.dService.baseURI + '/api/Customer/Search/' + this.searchKey)
    }
  }

  onSearch() {
    this.searchKey = this.searchText
    this.getCustomers()
  }

  resetSearch() {
    this.searchText = ''
    this.searchKey = ''
    this.getCustomers()
  }

  setDisplayCustomer(b: boolean) {
    this.displayCustomer = b;
    this.searchText = ''
    this.searchKey = ''
    if (b) {
      this.isEdit = false
      this.getCustomers()
    }
  }

  setDisplayUpdate(element: CustomerValue) {
    this.isEdit = true
    this.customerEdit = element
    this.setDisplayCustomer(false)
  }

  delete(element: CustomerValue) {
    this.http.delete(this.dService.baseURI + '/api/Customer/' + element.customerID, {headers: this.dService.headers})
      .subscribe(value => {
        if (typeof value !== undefined) {
          this.getCustomers()
        }
      }, error => {
        this.erroredSwal.title = 'Error code status ' + error.status
        this.erroredSwal.fire()
      })
  }

  insert(f: NgForm) {
    if (f.valid) {
      let body = {
        customerID: this.customerEdit?.customerID,
        cusFirstName: f.value.name.trim(),
        cusLastName: f.value.last.trim(),
        cusAddress: f.value.address.trim(),
      }
      this.getPutPost(body).subscribe(value => {
        if (typeof value !== undefined) {
          if (this.isEdit) {
            this.updatedSwal.fire()
          } else {
            f.resetForm()
            this.creactedSwal.fire()
          }
        }
      }, error => {
        this.erroredSwal.title = 'Error code status ' + error.status
        this.erroredSwal.fire()
      })
    }
  }

  getPutPost(body: any): Observable<any> {
    if (this.isEdit) {
      return this.http.put(this.dService.baseURI + '/api/Customer/Update', body, {headers: this.dService.headers})
    } else {
      return this.http.post(this.dService.baseURI + '/api/Customer/Insert', body, {headers: this.dService.headers})
    }
  }
}

interface ResData {
  message: string
  data: CustomerValue[]
}

export interface CustomerValue {
  customerID: number
  cusFirstName: string
  cusLastName: string
  cusAddress: string
}
