import { NgModule } from "@angular/core";

import { Routes, RouterModule } from '@angular/router';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { ResultsComponent } from './results/results.component';
import { ResultsGuard } from './../app/results/results.guard';

const appRoutes: Routes = [
    { path: '', component: SearchLandingComponent },
    { path: 'results',
     component: ResultsComponent,
     canActivate: [ResultsGuard]
     },  
  ];

  @NgModule ({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    
}