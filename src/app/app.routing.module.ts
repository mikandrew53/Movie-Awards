import { NgModule } from "@angular/core";

import { Routes, RouterModule } from '@angular/router';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { ResultsComponent } from './results/results.component';

const appRoutes: Routes = [
    { path: '', component: SearchLandingComponent },
    { path: 'results', component: ResultsComponent },  
  ];

  @NgModule ({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    
}