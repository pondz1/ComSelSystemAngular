import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {NgForm} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmComponent} from "../../dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {EditProTypeComponent} from "../../dialog/edit-pro-type/edit-pro-type.component";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css']
})
export class ProductTypeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['typeID', 'name', 'action'];
  dataSource = new MatTableDataSource<ValueDataType>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('errored')
  public readonly erroredSwal!: SwalComponent;

  constructor(private http: HttpClient, private dataSer: DataServiceService,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getTypes()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  getTypes(): void {
    this.http.get<ResData>(this.dataSer.baseURI + '/api/ProductType', {headers: this.dataSer.headers})
      .subscribe(value => {
        // // console.log(value)
        this.dataSource = new MatTableDataSource<ValueDataType>(value.data);
        this.dataSource.paginator = this.paginator;
      }, error => {

      })
  }

  insertType(f: NgForm): void {
    let body = {
      typeName: f.value.type
    }
    if (f.valid) {
      this.http.post(this.dataSer.baseURI + '/api/ProductType/Insert', body, {headers: this.dataSer.headers})
        .subscribe(value => {
          if (typeof value !== undefined) {
            f.resetForm()
            this.getTypes()
          }
        }, error => {

        })
    }
  }

  openDialog(data: SwalComponent): void {
    data.fire()
    // const dialogRef = this.dialog.open(ConfirmComponent, {
    //   width: '250px',
    //   data: data,
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed');
    //   this.getTypes()
    // });
  }

  openDialogEdit(element: ValueDataType) {
    const dialogRef = this.dialog.open(EditProTypeComponent, {
      width: '250px',
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.getTypes()
    });
  }

  deleteProduct(element: ValueDataType) {
    this.http.delete(this.dataSer.baseURI + '/api/ProductType/' + element.typeID)
      .subscribe(value => {
        // // console.log(value)
        if (typeof value !== undefined){
          this.getTypes()
        }
      }, error => {

      })
  }
}

interface ResData {
  message: string
  data: ValueDataType[]
}

export interface ValueDataType {
  typeID: number
  typeName: string
}
