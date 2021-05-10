import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from '../library.service';
import { movieFullInfo } from '../models/movieFullInfo.model';
import { OMDBService } from '../OMDB.service';
import {Location} from '@angular/common'; 
interface libraryItem {
  img: string,
  hide: boolean,
  imdbID: string,
  name: string,
  year: string, 
  inLibrary: boolean
}



@Component({
  selector: 'app-sharable-library',
  templateUrl: './sharable-library.component.html',
  styleUrls: ['./sharable-library.component.scss']
})
export class SharableLibraryComponent implements OnInit {
  myLibrary: Array<libraryItem> = [];
  movie:movieFullInfo;
  modalActive = false;
  dialogMovieIndex:number;
  url = 'http://192.168.2.73:4200';
  websitename = 'http://192.168.2.73:4200';
  moviesInUrl: Array<string> = []
  @ViewChild('urlUi', {static: true}) urlUI: ElementRef;

  constructor(
    private library:LibraryService,
    private OMDB: OMDBService,
    private router:Router,
    private snackbar:MatSnackBar, 
    private route:ActivatedRoute, 
    private location: Location) { }

  ngOnInit(): void {
    let movies = this.route.snapshot.queryParams; 
    if(Object.keys(movies).length === 0){
      console.log('here');
    
      this.initFromCurrentLibrary();
      let libraryIds = [];
      for(let i = 0; i < this.library.getLibrary().length; i++)
        libraryIds.push(this.library.getLibrary()[i].imdbId);
      this.router.navigate(['library'], {queryParams: {movie: libraryIds}});
      
      let tempUrl = `/library?`;
      console.log(this.moviesInUrl);
      
      for(let i = 0; i < this.moviesInUrl.length; i++)
        tempUrl += `movie=${this.moviesInUrl[i]}&`;
      this.url = this.websitename + tempUrl;
      
      
    }
    else {
      console.log(movies);
      
      if(Array.isArray(movies.movie))
        this.moviesInUrl = movies.movie;
      else 
        this.moviesInUrl = [movies.movie];
      let libraryMatches = ((this.library.getLibrary().length === movies.movie.length));
      
      
      
      if(!libraryMatches){
        this.library.setLibrary([]);
        this.library.resetLibraryIds();
        this.getMovies(this.moviesInUrl)
      }else {
        if(libraryMatches){
          for(let i = 0; i < this.moviesInUrl.length; i++){
            if(!this.library.checkIfMovieInLibrary(this.moviesInUrl[i])){
              libraryMatches = false;
              break;
            }
          }
        }
        if(!libraryMatches){
          this.library.setLibrary([]);
          this.library.resetLibraryIds();
          this.getMovies(this.moviesInUrl)
        }else {
          this.initFromCurrentLibrary();
          this.url += this.router.url;
        }

    }

    }

    
    
    this.movie = {
      name: '',
      img: '',
      imdbID: '',
      inLibrary: false,
      actors: '',
      plot: '',
      language: '',
      year: '',
      rated: '',
      releaseDate: '',
      runtime: '',
      genre: '',
      director: '',
      active: false,
      loading: false
    }
    
    if(this.moviesInUrl.length === 0){
      this.router.navigate(['']);
    }
  }

  initFromCurrentLibrary(){
    
    console.log('here');
    
    if(this.library.getLibrary().length !== 0){
      
      for(let i = 0; i < this.library.getLibrary().length; i++){
        this.myLibrary.push( {
          img: this.library.getLibrary()[i].img,
          hide: false,
          imdbID: this.library.getLibrary()[i].imdbId,
          name: this.library.getLibrary()[i].name,
          year: this.library.getLibrary()[i].year,
          inLibrary: true
        });
        this.moviesInUrl.push(this.library.getLibrary()[i].imdbId);
      }
      console.log(this.moviesInUrl);
    }
    
    
  }

  backToSearch() {
    this.router.navigate(['']);
  }

  async getMovies(movies){
    // console.log(movies);
    
    // console.log(this.library.getLibrary());
    for(let i = 0; i < movies.length; i++){
        await this.OMDB.getMovieShortPlot(movies[i])
        .then(data => {
        this.myLibrary.push({
          img: data.Poster,
          hide: false,
          imdbID: data.imdbID,
          name: data.Title,
          year: data.Year, 
          inLibrary: true
        });
        // console.log(this.library.addToLibrary(this.myLibrary[i].imdbID, this.myLibrary[i].img, this.myLibrary[i].name, this.myLibrary[i].year));
        this.library.addToLibrary(this.myLibrary[i].imdbID, this.myLibrary[i].img, this.myLibrary[i].name, this.myLibrary[i].year);
      });
    }
    // console.log(this.library.getLibrary());
  }

  removeFromLibrary(index?:number){
    let closeModal = false;
    if(index === undefined){
      index = this.dialogMovieIndex;
      this.movie.inLibrary = false;
      closeModal = true;
    }
    this.myLibrary[index].hide = true;
    this.library.removeFromLibrary(this.myLibrary[index].imdbID, true);
    this.myLibrary[index].inLibrary = false;    
    let tempUrl = `/library?`;
    // console.log(this.moviesInUrl);
    
    for(let i = 0; i < this.moviesInUrl.length; i++){
      if(this.myLibrary[index].imdbID === this.moviesInUrl[i]){
        this.moviesInUrl.splice(i, 1);
        break;
      }
    }
    for(let i = 0; i < this.moviesInUrl.length; i++)
      tempUrl += `movie=${this.moviesInUrl[i]}&`;
    // console.log(this.moviesInUrl);
    
    // console.log(this.url);
    // console.log(tempUrl);
    
    this.location.go(tempUrl);
    // this.url = tempUrl;
    this.url = this.websitename + tempUrl;
    setTimeout(() => this.myLibrary.splice(index, 1), 400);
    if(closeModal)
      this.closeModal();
    if(this.moviesInUrl.length === 0)
      this.router.navigate(['']);
    
  }
  
  removeFromUrl(){
    let movies = this.route.snapshot.queryParams;
    
  }
  // removeFromLibrary(index?:number){
  //     this.movie.inLibrary = false;
  //   }
  //   this.library.removeFromLibrary(this.results[index].imdbID);  
  // }

  copyLink() {
    this.urlUI.nativeElement.setSelectionRange(0, 99999); /* For mobile devices */
    this.urlUI.nativeElement.select(); /* For mobile devices */
    // document.getElementById('url').select();

  /* Copy the text inside the text field */
  document.execCommand("copy");
    this.snackbar.open('Link Coppied ', 'Okay', {
      duration: 4000,
      verticalPosition: 'bottom',
    });
  }

  openDialog(i): void {
    this.movie.loading = true;
    this.dialogMovieIndex = i;
    this.OMDB.getMovieShortPlot(this.myLibrary[i].imdbID)
    .then((data) => {
      this.movie.loading = false;
      if(data.Response === "True"){
        if(data.Actors !== 'N/A')
          this.movie['actors'] = data.Actors;
        if(data.Plot !== 'N/A' )
          this.movie['plot']= data.Plot;
        if(data.Language !== 'N/A')
          this.movie['language'] = data.Language;
        if(data.Year !== 'N/A')
          this.movie['year'] = data.Year;
        if(data.imdbRating !== 'N/A')
          this.movie['rated'] = data.imdbRating;
        if(data.Released !== 'N/A')
          this.movie['releaseDate'] = data.Released;
        if(data.Runtime !== 'N/A')
          this.movie['runtime'] = data.Runtime;
        if(data.Genre !== 'N/A')
          this.movie['genre'] = data.Genre;
        if(data.Director !== 'N/A')
          this.movie['director'] = data.Director;
      }
    });

    this.movie['name'] = this.myLibrary[i].name;
    this.movie['img'] = this.myLibrary[i].img;
    this.movie.imdbID = this.myLibrary[i].imdbID;
    this.movie.active = true;
    this.modalActive = true;
    this.movie.inLibrary = this.library.checkIfMovieInLibrary(this.movie.imdbID);
    document.body.style.overflowY = 'hidden';
    document.getElementById('results').style.overflowY = 'hidden';
    if(window.innerHeight === 500 || window.innerWidth === 670)
      document.getElementById('results').style.position = 'fixed';
  }

  closeModal(): void {
    this.modalActive = false;
    setTimeout(() => {
      this.movie.active = false;
    }, 250);
    document.body.style.overflowY = 'auto';
    document.getElementById('results').style.overflowY = 'auto';
    document.getElementById('results').style.position = 'relative';
  }

}
