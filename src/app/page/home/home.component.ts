import { Component, OnInit } from '@angular/core';
import {EmployType} from "../employee/employee.component";
import {FormControl, Validators} from "@angular/forms";
import {DataServiceService} from "../../service/data-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageName: any;
  selectFormControl = new FormControl('', Validators.required);

  employTypes: EmployType[] = [
    {typeName: 'Owner', typeId: 0},
    {typeName: 'Warehouse', typeId: 1},
    {typeName: 'Sales', typeId: 2}
  ]
  selectedType: number = 0;

  constructor(private data: DataServiceService) { }

  ngOnInit(): void {
    this.pageName = 'report'
  }
  setPage(value: string): void {
    this.pageName = value

  }

  onChange($event: any) {
    console.log($event)
    this.data.selectedType = $event
    this.pageName = 'report'
  }
}
