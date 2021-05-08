import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from '../library.service';
import { OMDBService } from '../OMDB.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { movieSuggestion } from './../models/movieSuggestion.model';
import { movieFullInfo } from './../models/movieFullInfo.model'

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
  movie:movieFullInfo;
  dialogMovieIndex:number;
  numMoviesInLibrary = 0;
  moreLoading = false;
  suggestionsLoading:boolean = false;
  numberOfTotalResultsInSuggestions: number = 0;
  numberOfSuggestionsfiltered:number = 0;
  numberOfResultsFiltered:number = 0;
  numberOfTotalResultsInResults: number = 0;
  
  constructor(private OMDB: OMDBService, private router: Router, private library: LibraryService, private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this.numMoviesInLibrary = this.library.getIndex();
    this.results = this.OMDB.getResults();
    this.numberOfTotalResultsInResults = this.OMDB.getTotalResults();
    this.numberOfResultsFiltered = this.OMDB.getTotalResultsFiltered();
    this.numberOfResultsFiltered < this.numberOfTotalResultsInResults ? this.isThereMoreResults = true: this.isThereMoreResults = false;
    this.search.nativeElement.value = this.OMDB.getSearchTerm();
    if(!(this.search.nativeElement.value.length < 3 && this.results.length === 0)){
      this.moreLoading = true;
      this.searchMovies({key: "Enter"});
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
    if(this.results){
      for(let i = 0; i < this.results.length; i++)
        this.results[i].inLibrary = this.library.checkIfMovieInLibrary(this.results[i].imdbID);
    }
    // if(this.results.length === 0 || this.results === undefined)
    //   this.onKeyUp({key: 'Enter'});
    this.search.nativeElement.value = this.OMDB.getSearchTerm();
  
    this.library.movieRemoved.subscribe(data => {
      if(data.removedFromLibrary){
        for(let i = 0; i < this.results.length; i++){
          if(this.results[i].imdbID === data.imdbID){
            this.results[i].inLibrary = false;
            if(this.movie.imdbID === data.imdbID){
              this.movie.inLibrary = false;
            }
            break;
          }   
        }
      }
    });

    this.library.indexChanged.subscribe(index => {
      this.numMoviesInLibrary = index
      if (this.numMoviesInLibrary === 5){
        this.snackbar.open('5 Movies Nominated!', 'Okay', {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      }
    });
       
  }
  openDialog(i): void {
    this.movie.loading = true;
    this.dialogMovieIndex = i;
    this.OMDB.getMovieShortPlot(this.results[i].imdbID)
    .then((data) => {
      this.movie.loading = false;
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
    document.getElementById('results').style.overflowY = 'hidden';
    document.getElementById('results').style.position = 'fixed';
    // this.resultsUI.nativeElement.style.overflowY = 'hidden';
    // document.body.style.touchAction = 'none';


  }
  closeModal(): void {
    // this.dialog.open(MoreInfoComponent, {data: {movie: this.results[i]}});
    this.modalActive = false;
    setTimeout(() => {
      this.movie.active = false;
    }, 250);
    document.body.style.overflowY = 'auto';
    document.getElementById('results').style.overflowY = 'auto';
    document.getElementById('results').style.position = 'relative';
    // this.resultsUI.nativeElement.style.overflowY = 'auto';
    
  }

  onKeyUp(e?) {
    if(e && e.key === "Enter"){
      this.page = 2;
      this.search.nativeElement.blur()
      this.inputFocus = false;
      this.results = [...this.suggestions];
      this.numberOfResultsFiltered = this.numberOfSuggestionsfiltered;
      this.numberOfResultsFiltered < this.numberOfTotalResultsInResults ? this.isThereMoreResults = true: this.isThereMoreResults = false;
      if(this.search.nativeElement.value.length < 3 && this.results.length === 0){
        this.isThereMoreResults = false;
        return;
      }
    }
    if(e && e.keyCode == 32){
      return;
    }
    this.suggestionsLoading = true;
    this.searchMovies(e);
  }
  
  searchMovies(e?) {
    let movieToSearch = this.search.nativeElement.value;
    this.OMDB.searchMovie(movieToSearch)
    .then(data => {
      this.numberOfTotalResultsInSuggestions = data.totalResults;
      this.suggestionsLoading = false;
      this.moreLoading = false;
      this.numberOfSuggestionsfiltered = 0;
      if(data.Response === 'True'){
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        let numberOfSuggestions = data.totalResults > 10 ? 10 : data.totalResults;
        let currentSuggestions:Array<movieSuggestion> = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          this.numberOfSuggestionsfiltered += 1;
          let movie = data.Search[i];
          let img = movie.Poster;
          if(movie.Poster === 'N/A')
            img = './../../assets/video-camera-5368055_1280.png';
          if(movie.Type !== "movie")
            continue;
          currentSuggestions.push({
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID,
              inLibrary: this.library.checkIfMovieInLibrary(movie.imdbID),
              animate: false,
              year: movie.Year
            });
        }
        
        this.suggestions = currentSuggestions;
        if(e && e.key === "Enter"){
          this.results = [...this.suggestions];
          this.numberOfTotalResultsInResults = data.totalResults;
          this.numberOfResultsFiltered = this.numberOfSuggestionsfiltered;
          this.numberOfResultsFiltered < this.numberOfTotalResultsInResults ? this.isThereMoreResults = true: this.isThereMoreResults = false;
        }
        
      }else {
        this.suggestions = [] 
        this.searchValid = false;
        this.isThereMoreResults = false;
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
        inLibrary: this.library.checkIfMovieInLibrary(data.imdbID),
        animate: false,
        year: data.Year
      }]
    });
  }

  moreClicked() {
    this.moreLoading = true;
    this.OMDB.getNextPage(this.page)
    .then(data => {
      this.moreLoading = false;
      console.log(data);
      if(data.Response === 'True'){
        this.page += 1;
        let j = 0;
        for(let i = 0; i < data.Search.length; i++){
          this.numberOfResultsFiltered += 1;
          let movie = data.Search[i];
          let img:string = movie.Poster;
          if(movie.Poster === 'N/A')
            img = './../../assets/video-camera-5368055_1280.png';
          if(movie.Type !== "movie")
            continue;
          this.results.push({
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID,
              inLibrary: this.library.checkIfMovieInLibrary(movie.imdbID),
              animate: false,
              year: movie.Year
            });
            j += 1;
        }
        console.log('Total Results Filtered:');
        console.log(this.numberOfResultsFiltered);
        console.log(this.numberOfTotalResultsInResults);
        
        
        if(this.numberOfResultsFiltered < this.numberOfTotalResultsInResults)
          this.isThereMoreResults = true;
        else 
          this.isThereMoreResults = false;
        this.OMDB.setIsThereMoreResults(this.isThereMoreResults);
      }else 
        this.isThereMoreResults = false
    })
  }

  onFocus(){
    console.log('focus');
    this.inputFocus = true;
    this.onKeyUp(false);

  }
  onFocusOut(){
    if(this.search.nativeElement !== document.activeElement)
      this.inputFocus = false;
  }

  searchClicked(){
    this.onKeyUp({key: 'Enter'});
  }

  addToLibrary(index?){
    if(index === undefined){
      index = this.dialogMovieIndex;
      this.movie.inLibrary = this.library.addToLibrary(this.results[index].imdbID, this.results[index].img);
      this.results[index].inLibrary = this.movie.inLibrary;
      this.results[index].animate = false;
      if(this.results[index].inLibrary){
        // this.numMoviesInLibrary += 1;
        // console.log(this.numMoviesInLibrary);  
        console.log('added');
      }
      return;
    }
    
    this.results[index].inLibrary = false;
      this.results[index].inLibrary = this.library.addToLibrary(this.results[index].imdbID, this.results[index].img);
      this.results[index].animate = this.results[index].inLibrary;
      if(this.results[index].inLibrary){
        // this.numMoviesInLibrary += 1;
        console.log(this.numMoviesInLibrary);  
      }
      // console.log(this.numMoviesInLibrary);
  }

  removeFromLibrary(index?:number){
    if(index === undefined){
      index = this.dialogMovieIndex;
      this.movie.inLibrary = false;
    }
    this.library.removeFromLibrary(this.results[index].img);  
    this.results[index].animate = false;
    this.results[index].inLibrary = false;
    // this.numMoviesInLibrary -= 1;
    console.log(this.numMoviesInLibrary);  
  }
  }



