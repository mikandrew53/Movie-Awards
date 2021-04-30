import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OMDPService } from '../OMDP.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @ViewChild('search', {static: true}) search: ElementRef;
  suggestions = [] 
  constructor(private OMDP: OMDPService, private router: Router) { }
  searchValid = true;
  
  
  ngOnInit(): void {
    if(!this.OMDP.getSearchTerm())
    this.router.navigate(['']);
    this.search.nativeElement.value = this.OMDP.getSearchTerm();

    this.suggestions = [
      {name: "Star Wars: Empire at War", img: "https://m.media-amazon.com/images/M/MV5BOGRiMDllMDUtOWFkZS00MGIyLWFkOTQtZjY2ZGUyNzY5YWRiXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0804909"},
      {name: "Star Wars Empire at War: Forces of Corruption", img: "https://m.media-amazon.com/images/M/MV5BNGIxYTZiMmQtYjYzMS00ZmExLTljZDktMjE1ODY5OTJlYjlmXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg", imdbID: "tt0879261"},
      {name: "Star Trek: Enterprise - In a Time of War", img: "https://m.media-amazon.com/images/M/MV5BMTk4NDA4MzUwM15BMl5BanBnXkFtZTgwMTg3NjY5MDE@._V1_SX300.jpg", imdbID: "tt3445408"},
      {name: "Star Trek: Starfleet Command: Volume II: Empires at War", img: "https://m.media-amazon.com/images/M/MV5BOTJiYjQxZDQtOWM5NS00ZDZhLWJkYTUtNjQ3ZjdiMzM1MDYyXkEyXkFqcGdeQXVyMzMxNDQ0NQ@@._V1_SX300.jpg", imdbID: "tt0272306"},
      {name: "Star Trek: The Next Generation - Survive and Suceed: An Empire at War", img: "https://m.media-amazon.com/images/M/MV5BMjM5ODY0MDQ2NF5BMl5BanBnXkFtZTgwMjQ5NDgwMDE@._V1_SX300.jpg", imdbID: "tt3060318"}
    ]
  }

  onKeyUp(e:Event) {
    let movieToSearch = this.search.nativeElement.value;
    this.OMDP.searchMovie(movieToSearch)
    .then(data => {
      if(data.Response === 'True' ){
        this.OMDP.setSearchData(data);
        console.log(this.OMDP.getSearchData());
        
        this.searchValid = true;
        let numberOfSuggestions = data.totalResults > 5 ? 5 : data.totalResults;
        let currentSuggestions = []
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          // console.log(data);
          
          if(movie.Poster !== 'N/A')
            img = movie.Poster;
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
    this.OMDP.setSearchTerm(this.suggestions[i].name);
    this.router.navigate(['results']);
  }

}


