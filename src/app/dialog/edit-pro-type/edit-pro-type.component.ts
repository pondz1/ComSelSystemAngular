import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValueDataType} from "../../page/product-type/product-type.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";

@Component({
  selector: 'app-edit-pro-type',
  templateUrl: './edit-pro-type.component.html',
  styleUrls: ['./edit-pro-type.component.css']
})
export class EditProTypeComponent {

  dataValue: ValueDataType;

  constructor(public dialogRef: MatDialogRef<EditProTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ValueDataType,
              private http: HttpClient, private dataServ: DataServiceService) {
    this.dataValue = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    // console.log(this.data)
    this.http.put(this.dataServ.baseURI + '/ProductType/Update', this.data, {headers: this.dataServ.headers})
      .subscribe(value => {
        // console.log(value)
        if (typeof value !== undefined) {
          this.dialogRef.close()
        }
      }, error => {

      })
  }

}
