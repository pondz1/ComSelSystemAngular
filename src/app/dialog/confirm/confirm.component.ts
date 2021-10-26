import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValueDataType} from "../../page/product-type/product-type.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ValueDataType,
              private http: HttpClient, private dataServ: DataServiceService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    // console.log(this.data)
    this.http.delete(this.dataServ.baseURI + '/ProductType/' + this.data.typeID)
      .subscribe(value => {
        // console.log(value)
        if (typeof value !== undefined){
          this.dialogRef.close()
        }
      }, error => {

      })
  }
}
