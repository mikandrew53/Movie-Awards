import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SearchLandingComponent } from './main-app/search-landing/search-landing.component';
import { ResultsComponent } from './../app/main-app/results/results.component';
import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharableLibraryComponent } from './sharable-library/sharable-library.component';
import { MainAppComponent } from './main-app/main-app.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchLandingComponent,
    ResultsComponent,
    SharableLibraryComponent,
    MainAppComponent,
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatSidenavModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
