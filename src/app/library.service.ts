import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


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
      return true;
    }
    return false;
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
