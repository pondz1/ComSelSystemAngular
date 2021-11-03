import {Component, OnInit, ViewChild} from '@angular/core';
import {ValueDataType} from "../product-type/product-type.component";
import {ValueDataProduct} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {DataServiceService} from "../../service/data-service.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {MatTableDataSource} from "@angular/material/table";
import {CdkAccordionItem} from "@angular/cdk/accordion";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  tabLoadTimes: Date[] = [];
  inventReport: InventReport[] = []
  dataSourceProduct: any = new MatTableDataSource<ValueDataProduct>();
  displayedColumnsProduct: string[] = ['proImage', 'productId', 'proName', 'proAmount',
    'proPrice', 'proBrand', 'proModel', 'proDetail'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  constructor(private http: HttpClient, private dService: DataServiceService) {
    // this.dataSourceInventory.data = this.TREE_DATA
  }

  ngOnInit(): void {
    this.getInventoryReport()
  }

  public createImgPath = (serverPath: string) => {
    if (serverPath == null) {
      return '/assets/upload-1.png'
    } else {
      return `${this.dService.baseURI}/${serverPath}`;
    }
  }


  onTabChange(event: MatTabChangeEvent) {
    console.log(event)
    if (event.index == 0) {
      this.getInventoryReport()
    }
  }

  getInventoryReport(): void {
    this.http.get<ResInventReport>(this.dService.baseURI + '/api/Report/InventoryReport')
      .subscribe(value => {
        this.inventReport = value.data
        console.log(value)
        // this.TREE_DATA = value.data.map(value1 => {
        //   return {
        //     name: value1.productType.typeName,
        //     length: value1.products.length,
        //     children: value1.products.map(value2 => {
        //       return {name: value2.proName,length: value2.proAmount}
        //     })
        //   }
        // })
        // this.dataSourceInventory.data = this.TREE_DATA
        // console.log(this.TREE_DATA)
        // this.TREE_DATA.push({name: value.data})
      }, error => {
        console.log(error)
      })
  }

  toggleAccordionItem(accordionItem: CdkAccordionItem, index: number) {
    accordionItem.toggle()
    this.dataSourceProduct.data = this.inventReport[index].products
    this.dataSourceProduct.paginator = this.paginator
  }
}

interface ResInventReport {
  message: string
  data: InventReport[]
}

interface InventReport {
  productType: ValueDataType
  products: ValueDataProduct[]
}

interface InventNode {
  name: string;
  length: number
  children?: InventNode[];
}
