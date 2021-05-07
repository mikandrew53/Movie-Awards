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

  loading:boolean = false;

  constructor(private OMDB: OMDPService, private router: Router){
  }

  ngOnInit(): void {
    this.suggestions = []
  }


  onKeyUp(e?) {
    this.loading = true;
    let movieToSearch = this.search.nativeElement.value;
    if(e && e.key === "Enter"){
      this.onSearch();

      return;
    }
    this.OMDB.searchMovie(movieToSearch)
    .then(data => {
      this.loading = false;
      if(data.Response === 'True' ){
        this.suggestions = [];
        this.results = [];
        this.OMDB.setResults(this.results);
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        let numberOfSuggestions = data.Search.length;
        let currentSuggestions = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          if(movie.Poster === 'N/A' || movie.Type !== "movie")
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
