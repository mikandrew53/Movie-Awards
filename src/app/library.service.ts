import { stringify } from '@angular/compiler/src/util';
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
    let libraryData = JSON.parse(localStorage.getItem('libraryData'));
    let index = JSON.parse(localStorage.getItem('numberOfMoviesInLibrary'));
    console.log(libraryData);
    if(libraryData && index){
      this.library = libraryData;
      this.index = index;
    
    }
  }

  addToLibrary (movieId: string, imgUrl:string){
    if(this.index < 5 && !this.library[movieId]){
      console.log('yo');
      
      this.index += 1;
      this.library[movieId] = imgUrl;
      this.libChanged.next(imgUrl);
      localStorage.setItem('libraryData', JSON.stringify(this.library));
      localStorage.setItem('numberOfMoviesInLibrary', JSON.stringify(this.index));
      return true;
    }
    return false;
  }

  checkIfMovieInLibrary(movieId: string){
    return this.library[movieId];
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
    localStorage.setItem('libraryData', JSON.stringify(this.library));
    localStorage.setItem('numberOfMoviesInLibrary', JSON.stringify(this.index));
  }

  getLibrary(){
    return this.library;
  }
}
