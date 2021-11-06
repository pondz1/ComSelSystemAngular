import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './page/home/home.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {ProductComponent} from './page/product/product.component';
import {ProductTypeComponent} from './page/product-type/product-type.component';
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from '@angular/common/http';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from "@angular/material/dialog";
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { EditProTypeComponent } from './dialog/edit-pro-type/edit-pro-type.component';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CustomerComponent } from './page/customer/customer.component';
import { EmployeeComponent } from './page/employee/employee.component';
import { ReportComponent } from './page/report/report.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatTreeModule} from "@angular/material/tree";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import { ProductSetComponent } from './page/product-set/product-set.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { ProductSetListComponent } from './page/product-set-list/product-set-list.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { BuyComponent } from './page/buy/buy.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { BottomSheetSetComponent } from './BottomSheet/bottom-sheet-set/bottom-sheet-set.component';
import {MatListModule} from "@angular/material/list";
import { ReportCustomerComponent } from './page/report-customer/report-customer.component';
import { ProductBuyListComponent } from './BottomSheet/product-buy-list/product-buy-list.component';
import { ReportSalesRevenueComponent } from './page/report-sales-revenue/report-sales-revenue.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    ProductTypeComponent,
    ConfirmComponent,
    EditProTypeComponent,
    CustomerComponent,
    EmployeeComponent,
    ReportComponent,
    ProductSetComponent,
    ProductSetListComponent,
    BuyComponent,
    BottomSheetSetComponent,
    ReportCustomerComponent,
    ProductBuyListComponent,
    ReportSalesRevenueComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatTableModule,
        HttpClientModule,
        MatPaginatorModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCardModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        SweetAlert2Module.forRoot(),
        MatTabsModule,
        MatTreeModule,
        CdkAccordionModule,
        DragDropModule,
        ScrollingModule,
        MatExpansionModule,
        MatTooltipModule,
        MatListModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
