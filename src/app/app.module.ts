import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SearchLandingComponent } from './search-landing/search-landing.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchLandingComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
