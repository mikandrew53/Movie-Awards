import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { LibraryService } from "../library.service";
import {Location} from '@angular/common'; 


@Injectable({providedIn: 'root'})

export class LibraryGuard implements CanActivate {

    constructor( 
        private route: ActivatedRoute, 
        private router: Router, 
        private library: LibraryService,
        private location: Location 
        ){}
    index = 0;
    url = 'http://192.168.2.73:4200/library';
    // url = 'https://shoppies-5b855.firebaseapp.com/';
    // websitename = 'https://shoppies-5b855.firebaseapp.com/';
    websitename = 'http://192.168.2.73:4200';
    canActivate() {
        this.route.params.subscribe(params => {
            console.log(Object.keys(params).length === 0);
            console.log(params);
            console.log(this.router.url);
            console.log(window.location.href);
            
            if(this.index > 0){
                if(this.library.getLibrary().length === 0 && Object.keys(params).length === 0 ){
                    console.log('here');
                    this.router.navigate(['']);
                }
            }
            this.index += 1;
            
        });
        return true;
    }    
}