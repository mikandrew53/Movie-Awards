import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { ResultsComponent } from './results/results.component';
import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MoreInfoComponent } from './results/more-info/more-info';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    SearchLandingComponent,
    ResultsComponent,
    MoreInfoComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatSidenavModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
