import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from '../library.service';
import { OMDPService } from '../OMDP.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


interface movieSuggestion {
  name: string,
  img: string,
  imdbID?: string,
  inLibrary: boolean
}

interface responseData {
  Actors: string,
  Awards: string
  BoxOffice: string,
  Country: string,
  DVD: string,
  Director: string,
  Genre: string,
  Language: string,
  Metascore: string,
  Plot: string,
  Poster: string,
  Production: string,
  Rated: string,
  Ratings: [],
  Released: string,
  Response: string,
  Runtime: string,
  Title: string,
  Type: string,
  Website: string,
  Writer: string,
  Year: string,
  imdbID: string,
  imdbRating: string,
  imdbVotes: string
}

interface movie{
  name: string,
  img: string,
  imdbID?: string,
  inLibrary: boolean,
  actors: string,
  plot: string,
  language: string,
  year: string,
  rated: string,
  releaseDate: string,
  runtime: string,
  genre: string,
  director: string,
  active: boolean
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @ViewChild('search', {static: true}) search: ElementRef;
  suggestions: Array<movieSuggestion> = [];
  searchValid = true;
  inputFocus = false;
  noResults = false;
  results: Array<movieSuggestion> = [];
  isThereMoreResults: boolean = false;
  page = 2;
  modalActive = false;
  movie:movie;
  
  constructor(private OMDB: OMDPService, private router: Router, private library: LibraryService, public dialog: MatDialog) { }
  
  ngOnInit(): void {
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
      active: false
    }

    this.results = this.OMDB.getResults();
    this.isThereMoreResults = this.OMDB.getIsThereMoreResults();
    
    if(!this.OMDB.getSearchTerm())
      this.router.navigate(['']);
    if(this.results.length === 0)
      this.onKeyUp({key: 'Enter'});
    this.search.nativeElement.value = this.OMDB.getSearchTerm();
  }

  openDialog(i): void {
    this.OMDB.getMovieShortPlot(this.results[i].imdbID)
    .then((data:responseData) => {
      console.log(data);
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

    this.movie['name'] = this.results[i].name;
    this.movie['img'] = this.results[i].img;
    this.movie.imdbID = this.results[i].imdbID;
    this.movie.active = true;
    this.modalActive = true;
    this.movie.inLibrary = this.library.checkIfMovieInLibrary(this.movie.imdbID);
    document.body.style.overflowY = 'hidden';


  }
  closeModal(): void {
    // this.dialog.open(MoreInfoComponent, {data: {movie: this.results[i]}});
    this.modalActive = false;
    setTimeout(() => {
      this.movie.active = false;
    }, 250);
    document.body.style.overflowY = 'auto';
  }


  onKeyUp(e?) {
    let movieToSearch = this.search.nativeElement.value;
    this.OMDB.searchMovie(movieToSearch)
    .then(data => {
      // console.log(data);
      
      if(data.Response === 'True' ){
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        let numberOfSuggestions = data.totalResults > 10 ? 10 : data.totalResults;
        let currentSuggestions = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          img = movie.Poster;
          if(movie.Poster === 'N/A' || movie.Type !== "movie")
            continue;
          currentSuggestions.push(
            {
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID
            }
          )
        }
        
        this.suggestions = currentSuggestions;
        
      }else {
        this.suggestions = [] 
        this.searchValid = false;
      }
      if(e && e.key === "Enter"){
        this.page = 2;
        this.search.nativeElement.blur()
        this.inputFocus = false;
        this.results = [...this.suggestions];
        this.isThereMoreResults = this.results.length > 9 && this.OMDB.getSearchData().totalResults > 10;
        this.OMDB.setIsThereMoreResults(this.isThereMoreResults);
        if(!this.searchValid)
          this.noResults = false;
      }
    }); 
  }

  suggestionClicked(i){
    this.search.nativeElement.value = this.suggestions[i].name;
    this.inputFocus = false;
    this.OMDB.setSearchTerm(this.suggestions[i].name);
    // console.log(this.suggestions[i].imdbID);
    this.isThereMoreResults = false;
    this.OMDB.setIsThereMoreResults(this.isThereMoreResults);

    this.OMDB.getMovieShortPlot(this.suggestions[i].imdbID)
    .then(data => {
      // console.log(data);
      this.results = [{
        name: data.Title,
        img: data.Poster,
        imdbID: data.imdbID,
        inLibrary: false
      }]
    });
  }

  moreClicked() {
    this.OMDB.getNextPage(this.page)
    .then(data => {
      if(data.Response === 'True'){
        this.page += 1;
        let j = 0;
        for(let i = 0; i < data.Search.length; i++){
          let movie = data.Search[i];
          let img = '';
          img = movie.Poster;
          if(movie.Poster === 'N/A')
            continue;
          this.results.push({
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID,
              inLibrary: false
            });
            j += 1;
        }
        // console.log(j);
        
        if(j === 10 && (this.results.length < data.totalResults))
          this.isThereMoreResults = true;
        else 
          this.isThereMoreResults = false;
        this.OMDB.setIsThereMoreResults(this.isThereMoreResults);
      }
    })
  }

  onFocus(){
    this.inputFocus = true;
    this.onKeyUp();

  }
  onFocusOut(){
    if(this.search.nativeElement !== document.activeElement)
      this.inputFocus = false;
  }

  searchClicked(){
    this.onKeyUp({key: 'Enter'});
  }

  addToLibrary(index){
    console.log(this.results[index].inLibrary);
    this.results[index].inLibrary = false;
    console.log(this.results[index].inLibrary);
    setTimeout(() => {
      this.results[index].inLibrary = this.library.addToLibrary(this.results[index].imdbID, this.results[index].img)
    }, 0);
    console.log(this.results[index].inLibrary);
    
  }

  moreInfo(index){
    console.log('img clicked');
    
  }


 

}


