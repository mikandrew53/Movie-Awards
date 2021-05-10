import { NgModule } from "@angular/core";

import { Routes, RouterModule } from '@angular/router';
import { SearchLandingComponent } from './main-app/search-landing/search-landing.component';
import { ResultsComponent } from './../app/main-app/results/results.component';
import { ResultsGuard } from './../app/main-app/results/results.guard';
import { MainAppComponent } from "./main-app/main-app.component";
import { SharableLibraryComponent } from "./sharable-library/sharable-library.component";
import { LibraryGuard } from './../app/sharable-library/library.guard'

const appRoutes: Routes = [
    { path: '', component: MainAppComponent, children: [
        { path: '', component: SearchLandingComponent },
        { path: 'results',
         component: ResultsComponent,
         canActivate: [ResultsGuard]
         },  
    ] },
    { path: 'library', component: SharableLibraryComponent, canActivate: [LibraryGuard]}
  ];

  @NgModule ({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    
}