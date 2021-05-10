import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { OMDBService } from "./../../OMDB.service";

@Injectable({providedIn: 'root'})

export class ResultsGuard implements CanActivate {

    constructor(private OMDB: OMDBService, private router: Router){}

    canActivate() {
        if(!this.OMDB.getSearchTerm() || this.OMDB.getSearchTerm().length < 3)
            return this.router.navigate(['']);
        return true;
    }
    
}