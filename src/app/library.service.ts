import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private library = {};
  index:number = 0;
  libChanged = new Subject<string>();
  constructor() {
   }

  addToLibrary (movieId: string, imgUrl:string){
    if(this.index < 5 && !this.library[movieId]){
      console.log('yo');
      
      this.index += 1;
      this.library[movieId] = imgUrl;
      this.libChanged.next(imgUrl);
    }
  }
  
  removeFromLibrary(url:string){
    console.log(url);
    for(let movieId in this.library){
      console.log(movieId);
      if(this.library[movieId] == url){
        delete this.library[movieId];
        break;
      }
    }
    this.index -= 1;
  }

  getLibrary(){
    return this.library;
  }
}
