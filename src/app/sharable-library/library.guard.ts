import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { LibraryService } from "../library.service";


@Injectable({providedIn: 'root'})

export class LibraryGuard implements CanActivate {

    constructor( private route: ActivatedRoute, private router: Router, private library: LibraryService){}
    index = 0;
    canActivate() {
        
        // this.route.queryParams.subscribe(params => {
        //     console.log(params);
        //     console.log(params.movie);
        //     console.log(this.route);
            
        //     if(this.library.getLibrary().length !== 0)
        //         return true;
        //     else if(Object.keys(params).length === 0 && this.library.getLibrary().length === 0)
        //         this.router.navigate(['']);
        //     else if (params.movie.length === 0 && this.library.getLibrary().length === 0)
        //         this.router.navigate(['']);
        //     this.index += 1; 
        // });
        return true;
        
    }
    
}