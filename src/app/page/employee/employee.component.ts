import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {Observable} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {FormControl, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  searchText: any = '';
  searchKey: any = '';
  dataSource: any = new MatTableDataSource<EmployeeValue>();
  displayedColumns: string[] = ['employeeID', 'empName', 'empPosition',
    'empAddress', 'empSalary', 'empJoiningDate', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isEdit: boolean = false
  employeeEdit: EmployeeValue | undefined

  @ViewChild('created')
  public readonly creactedSwal!: SwalComponent;

  @ViewChild('updated')
  public readonly updatedSwal!: SwalComponent;

  @ViewChild('errored')
  public readonly erroredSwal!: SwalComponent;
  selectFormControl: any = new FormControl('', Validators.required);
  selectedType: any;
  employTypes: EmployType[] = [
    {typeName: 'Owner', typeId: 0},
    {typeName: 'Warehouse', typeId: 1},
    {typeName: 'Sales', typeId: 2}
  ]
  displayEmployee: any = true;

  constructor(private http: HttpClient, private dService: DataServiceService) {
  }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.getEmployee()
    }
  }

  getEmployee(): void {
    this.getResData().subscribe(value => {
      this.dataSource = new MatTableDataSource<EmployeeValue>(value.data)
      this.dataSource.paginator = this.paginator;
    });
  }

  getResData(): Observable<ResData> {
    if (this.searchKey == '') {
      return this.http.get<ResData>(this.dService.baseURI + '/api/Employee')
    } else {
      return this.http.get<ResData>(this.dService.baseURI + '/api/Employee/Search/' + this.searchKey)
    }
  }

  onSearch() {
    this.searchKey = this.searchText
    this.getEmployee()
  }

  resetSearch() {
    this.searchText = ''
    this.searchKey = ''
    this.getEmployee()
  }

  setDisplayEmployee(b: boolean) {
    this.displayEmployee = b
    this.searchText = ''
    this.searchKey = ''
    if (b) {
      this.getEmployee()
      this.isEdit = false
    }
  }

  setDisplayUpdate(element: EmployeeValue) {
    this.isEdit = true
    this.employeeEdit = element
    this.selectFormControl.setValue(element.empPosition)
    this.selectedType = element.empPosition
    this.setDisplayEmployee(false)
  }

  delete(element: any) {
    this.http.delete(this.dService.baseURI + '/api/Employee/' + element.customerID, {headers: this.dService.headers})
      .subscribe(value => {
          if (typeof value !== undefined) {
            this.getEmployee()
          }
        }, error => {
        this.erroredSwal.title = 'Error code status ' + error.status
        this.erroredSwal.fire()
        }
      )
  }

  insert(f: NgForm) {
    let timestamp = new Date().getTime() / 1000
    if (f.valid && this.selectFormControl.valid) {
      let body = {
        employeeID: this.employeeEdit?.employeeID,
        empName: f.value.name.trim(),
        empLastName: f.value.last.trim(),
        empPosition: this.selectedType,
        empAddress: f.value.address,
        empSalary: f.value.salary,
        empJoiningDate: this.isEdit ? this.employeeEdit?.empJoiningDate : timestamp
      }
      // console.log(body)
      this.getPutPost(body).subscribe(value => {
        if (typeof value !== undefined) {
          if (this.isEdit) {
            this.updatedSwal.fire()
          } else {
            this.creactedSwal.fire()
            f.resetForm()
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
      return this.http.put(this.dService.baseURI + '/api/Employee/Update', body, {headers: this.dService.headers})
    } else {
      return this.http.post(this.dService.baseURI + '/api/Employee/Insert', body, {headers: this.dService.headers})
    }
  }

  toDate(value: number) {
    const date = new Date(value * 1000);
    return date.getUTCDate() + '/' + (date.getMonth() + 1 )+ '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
  }

  positionMap(index: number): string {
    let map = ['Owner','Warehouse','Sales']
    return map[index]
  }

}

interface ResData {
  message: string
  data: EmployeeValue[]
}

interface EmployType {
  typeId: number
  typeName: string
}

export interface EmployeeValue {
  employeeID: number
  empName: string
  empLastName: string
  empPosition: number
  empAddress: string
  empSalary: number
  empJoiningDate: number
}
