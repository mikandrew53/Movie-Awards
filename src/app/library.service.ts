import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { libraryItem } from './../app/models/LibraryItem.model'

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private library: Array<libraryItem>;
  private libraryIds = {};
  libChanged = new Subject<{img: string, imdbID: string, name: string, year: string}>();
  movieRemoved = new Subject<{imdbID: string, removedFromLibrary:boolean}>();
  indexChanged = new Subject <number>();

  constructor() {
    let libraryData = JSON.parse(localStorage.getItem('libraryData'));
    if(libraryData){
      this.library = libraryData;
      for(let i = 0; i < this.library.length; i++)
        this.libraryIds[this.library[i].imdbId] = true;
    }else {
      this.library = [];
    }
  }

  addToLibrary (movieId: string, imgUrl:string, name: string, year: string){
    if(this.library.length < 5 && !this.libraryIds[movieId]){
      this.library.push({
        imdbId: movieId,
        img: imgUrl,
        name: name,
        year: year
      });
      this.indexChanged.next(this.library.length);
      this.libChanged.next({img: imgUrl, imdbID: movieId, name: name, year: year});
      localStorage.setItem('libraryData', JSON.stringify(this.library));
      this.libraryIds[movieId] = true;
      return true;
    }
    return false;
  }

  checkIfMovieInLibrary(movieId: string): boolean{
    if(this.libraryIds[movieId])
      return true;
    return false;
  }
  
  removeFromLibrary(imdbID:string, removedFromLibrary?:boolean){
    if(removedFromLibrary === undefined)
      removedFromLibrary = false;
    for(let i = 0; i < this.library.length; i++){
      if(this.library[i].imdbId === imdbID){
        this.movieRemoved.next({imdbID: imdbID, removedFromLibrary: removedFromLibrary});
        delete this.libraryIds[imdbID];
        this.library.splice(i, 1);
        break;
      }
    }
    this.indexChanged.next(this.library.length);
    localStorage.setItem('libraryData', JSON.stringify(this.library));
    
  }
  
  getLibrary(){
    return this.library;
  }
  setLibrary(library) {
    this.library = library;
  }

  resetLibraryIds(){
    this.libraryIds = {};
  }
}
