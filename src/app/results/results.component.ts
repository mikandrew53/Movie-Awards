import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OMDPService } from '../OMDP.service';

interface movieSuggestion {
  name: string,
  img: string,
  imdbID?: string
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
  
  constructor(private OMDB: OMDPService, private router: Router) { }
  
  ngOnInit(): void {
    this.results = this.OMDB.getResults();
    this.isThereMoreResults = this.OMDB.getIsThereMoreResults();

    if(!this.OMDB.getSearchTerm())
      this.router.navigate(['']);
    this.search.nativeElement.value = this.OMDB.getSearchTerm();

    this.suggestions = [
      // {name: "Star Wars: Empire at War", img: "https://m.media-amazon.com/images/M/MV5BOGRiMDllMDUtOWFkZS00MGIyLWFkOTQtZjY2ZGUyNzY5YWRiXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0804909"},
      // {name: "Star Wars Empire at War: Forces of Corruption", img: "https://m.media-amazon.com/images/M/MV5BNGIxYTZiMmQtYjYzMS00ZmExLTljZDktMjE1ODY5OTJlYjlmXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0879261"},
      // {name: "Star Trek: Enterprise - In a Time of War", img: "https://m.media-amazon.com/images/M/MV5BMTk4NDA4MzUwM15BMl5BanBnXkFtZTgwMTg3NjY5MDE@._V1_SX300.jpg", imdbID: "tt3445408"},
      // {name: "Star Trek: Starfleet Command: Volume II: Empires at War", img: "https://m.media-amazon.com/images/M/MV5BOTJiYjQxZDQtOWM5NS00ZDZhLWJkYTUtNjQ3ZjdiMzM1MDYyXkEyXkFqcGdeQXVyMzMxNDQ0NQ@@._V1_SX300.jpg", imdbID: "tt0272306"},
      // {name: "Star Trek: The Next Generation - Survive and Suceed: An Empire at War", img: "https://m.media-amazon.com/images/M/MV5BMjM5ODY0MDQ2NF5BMl5BanBnXkFtZTgwMjQ5NDgwMDE@._V1_SX300.jpg", imdbID: "tt3060318"}
    ]
    // this.results = this.suggestions;
  }


  onKeyUp(e?) {
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
    
    let movieToSearch = this.search.nativeElement.value;
    this.OMDB.searchMovie(movieToSearch)
    .then(data => {
      console.log(data);
      
      if(data.Response === 'True' ){
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        let numberOfSuggestions = data.totalResults > 10 ? 10 : data.totalResults;
        let currentSuggestions = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          img = movie.Poster;
          if(movie.Poster === 'N/A')
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
    }); 
  }

  suggestionClicked(i){
    this.search.nativeElement.value = this.suggestions[i].name;
    this.inputFocus = false;
    this.OMDB.setSearchTerm(this.suggestions[i].name);
    console.log(this.suggestions[i].imdbID);
    this.isThereMoreResults = false;
    this.OMDB.setIsThereMoreResults(this.isThereMoreResults);

    this.OMDB.getMovieShortPlot(this.suggestions[i].imdbID)
    .then(data => {
      console.log(data);
      this.results = [{
        name: data.Title,
        img: data.Poster,
        imdbID: data.imdbID
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
              imdbID: movie.imdbID
            });
            j += 1;
        }
        console.log(j);
        
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

}


