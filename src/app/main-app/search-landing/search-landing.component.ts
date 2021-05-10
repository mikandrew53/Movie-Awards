import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OMDBService } from '../../OMDB.service';
interface movieSuggestion {
  name: string,
  img: string,
  imdbID: string,
  year: string
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
  numberOfMoviesFiltered:number = 0;

  constructor(private OMDB: OMDBService, private router: Router){
  }

  ngOnInit(): void {
    this.suggestions = []
  }


  onKeyUp(e?) {
    let movieToSearch = this.search.nativeElement.value;
    if(e && e.key === "Enter"){
      this.onSearch();
      return;
    }
    if(this.search.nativeElement.value.length < 3){
      this.suggestions = [];
      return;
    }
    this.loading = true;
    this.OMDB.searchMovie(movieToSearch)
    .then(data => {
      this.OMDB.setTotalResults(data.totalResults);
      this.loading = false;
      if(data.Response === 'True' ){
        this.numberOfMoviesFiltered = 0;
        this.suggestions = [];
        this.results = [];
        this.OMDB.setResults(this.results);
        this.OMDB.setSearchData(data);
        this.searchValid = true;
        let numberOfSuggestions = data.Search.length;
        let currentSuggestions = [];
        const ids = {}
        
        for(let i = 0; i < numberOfSuggestions; i++){
          
          this.numberOfMoviesFiltered += 1;
          let movie = data.Search[i];
          let img = movie.Poster;
          if(ids[movie.imdbID])
            continue;
          if(movie.Poster === 'N/A')
            img = 'assets/video-camera-5368055_1280.png';
          if(movie.Type !== "movie")
            continue;
          if(i < 5){
            currentSuggestions.push({
                name: movie.Title,
                img: img,
                imdbID: movie.imdbID,
                year: movie.Year
            });
          }
          this.results.push(
            {
              name: movie.Title,
              img: img,
              imdbID: movie.imdbID,
              year: movie.Year
            }
          )
          ids[movie.imdbID] = true;
        }
        this.OMDB.setTotalResultsFiltered(this.numberOfMoviesFiltered);
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
      this.OMDB.setTotalResults(1);
      this.results = [{
        name: data.Title,
        img: data.Poster,
        imdbID: data.imdbID,
        year: data.Year
      }]
      this.router.navigate(['results']);
      this.OMDB.setResults(this.results);
    });


  }

  onSearch(){
    this.OMDB.setSearchTerm(this.search.nativeElement.value)
    if(this.search.nativeElement.value){
      this.router.navigate(['results']);
      this.OMDB.setResults(this.results);
    }

  }

}
