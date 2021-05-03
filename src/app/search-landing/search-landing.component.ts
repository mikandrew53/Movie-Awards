import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OMDPService } from '../OMDP.service';
interface movieSuggestion {
  name: string,
  img: string,
  imdbID?: string
}

@Component({
  selector: 'app-search-landing',
  templateUrl: './search-landing.component.html',
  styleUrls: ['./search-landing.component.scss']
})
export class SearchLandingComponent implements OnInit {
  searchValid = false;
  @ViewChild('search', {static: true}) search: ElementRef;
  results: Array<movieSuggestion> = [];

  suggestions:Array<movieSuggestion> = []

  constructor(private OMDB: OMDPService, private router: Router){
  }

  ngOnInit(): void {
this.suggestions = [
      // {name: "Star Wars: Empire at War", img: "https://m.media-amazon.com/images/M/MV5BOGRiMDllMDUtOWFkZS00MGIyLWFkOTQtZjY2ZGUyNzY5YWRiXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0804909"},
      // {name: "Star Wars Empire at War: Forces of Corruption", img: "https://m.media-amazon.com/images/M/MV5BNGIxYTZiMmQtYjYzMS00ZmExLTljZDktMjE1ODY5OTJlYjlmXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0879261"},
      // {name: "Star Trek: Enterprise - In a Time of War", img: "https://m.media-amazon.com/images/M/MV5BMTk4NDA4MzUwM15BMl5BanBnXkFtZTgwMTg3NjY5MDE@._V1_SX300.jpg", imdbID: "tt3445408"},
      // {name: "Star Trek: Starfleet Command: Volume II: Empires at War", img: "https://m.media-amazon.com/images/M/MV5BOTJiYjQxZDQtOWM5NS00ZDZhLWJkYTUtNjQ3ZjdiMzM1MDYyXkEyXkFqcGdeQXVyMzMxNDQ0NQ@@._V1_SX300.jpg", imdbID: "tt0272306"},
      // {name: "Star Trek: The Next Generation - Survive and Suceed: An Empire at War", img: "https://m.media-amazon.com/images/M/MV5BMjM5ODY0MDQ2NF5BMl5BanBnXkFtZTgwMjQ5NDgwMDE@._V1_SX300.jpg", imdbID: "tt3060318"}
    ]
  }


  onKeyUp(e?) {
    let movieToSearch = this.search.nativeElement.value;
    if(e && e.key === "Enter"){
      this.onSearch();

      return;
    }
    this.OMDB.searchMovie(movieToSearch)
      
    .then(data => {
      if(data.Response === 'True' ){
        console.log(data);
        
        this.suggestions = [];
        this.results = [];
        this.OMDB.setResults(this.results);
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        // let numberOfSuggestions = data.totalResults > 5 ? 5 : data.totalResults;
        let numberOfSuggestions = data.Search.length;

        let currentSuggestions = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          // console.log(data);
          
          if(movie.Poster === 'N/A')
            continue;
          img = movie.Poster;
          if(i < 5){
            currentSuggestions.push(
              {
                name: movie.Title,
                img: img,
                imdbID: movie.imdbID
              }
            )
          }
          this.results.push(
            {
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID
            }
          )
        }
        this.OMDB.setIsThereMoreResults(this.results.length > 9 && data.totalResults > 10);
        this.suggestions = currentSuggestions;
        this.OMDB.setResults(this.results);
        
      }else {
        this.suggestions = [];
        this.results = [];
        this.OMDB.setResults(this.results);
        this.searchValid = false;
        this.OMDB.setIsThereMoreResults(false);
      }
    }); 

    console.log(this.OMDB.getResults());
    
  }

  suggestionClicked(i){
    this.search.nativeElement.value = this.suggestions[i].name;
    this.OMDB.setSearchTerm(this.suggestions[i].name);
    this.OMDB.setIsThereMoreResults(false);
    this.OMDB.getMovieShortPlot(this.suggestions[i].imdbID)
    .then(data => {
      this.results = [{
        name: data.Title,
        img: data.Poster,
        imdbID: data.imdbID
      }]
      this.router.navigate(['results']);
      this.OMDB.setResults(this.results);
    });


  }

  onSearch(){
    this.OMDB.setSearchTerm(this.search.nativeElement.value)
    if(this.search.nativeElement.value){
      console.log(this.results);
      
      this.router.navigate(['results']);
      this.OMDB.setResults(this.results);
    }

  }

}
