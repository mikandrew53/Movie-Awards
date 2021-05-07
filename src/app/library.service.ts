import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private library;
  private index:number;
  libChanged = new Subject<{img: string, imdbID: string}>();
  movieRemoved = new Subject<{imdbID: string, removedFromLibrary:boolean}>();
  indexChanged = new Subject <number>();

  constructor() {
    let libraryData = JSON.parse(localStorage.getItem('libraryData'));
    let index = JSON.parse(localStorage.getItem('numberOfMoviesInLibrary'));
    if(libraryData && index){
      this.library = libraryData;
      this.index = index;
    }else {
      this.index = 0;
      this.library = {};
    }
    // console.log(this.index);
    
  }

  addToLibrary (movieId: string, imgUrl:string){
    if(this.index < 5 && !this.library[movieId]){
      console.log('yo');
      
      this.index += 1;
      this.library[movieId] = imgUrl;
      this.indexChanged.next(this.index);
      this.libChanged.next({img: imgUrl, imdbID: movieId});
      localStorage.setItem('libraryData', JSON.stringify(this.library));
      localStorage.setItem('numberOfMoviesInLibrary', JSON.stringify(this.index));
      return true;
    }
    return false;
  }

  checkIfMovieInLibrary(movieId: string): boolean{
    if(this.library[movieId])
      return true;
    return false;
  }
  
  removeFromLibrary(url:string, removedFromLibrary?:boolean){
    if(removedFromLibrary === undefined)
      removedFromLibrary = false;
    for(let movieId in this.library){
      console.log(movieId);
      if(this.library[movieId] == url){
        this.movieRemoved.next({imdbID: movieId, removedFromLibrary: removedFromLibrary});
        delete this.library[movieId];
        break;
      }
    }
    this.index -= 1;
    this.indexChanged.next(this.index);
    localStorage.setItem('libraryData', JSON.stringify(this.library));
    localStorage.setItem('numberOfMoviesInLibrary', JSON.stringify(this.index));
  }

  getLibrary(){
    return this.library;
  }
  getIndex(){
    return this.index;
  }
}
