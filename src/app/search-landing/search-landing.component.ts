import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('search', {static: true}) search: ElementRef;

  suggestions:Array<movieSuggestion> = []

  constructor(private OMDP: OMDPService){
  }

  ngOnInit(): void {
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
      console.log(data);
      
      if(data.Response === 'True' ){
        let numberOfSuggestions = data.totalResults > 5 ? 5 : data.totalResults;
        let currentSuggestions = []
        console.log();
        
        for(let i = 0; i < numberOfSuggestions; i++){
          let movie = data.Search[i];
          let img = '';
          console.log(data);
          
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
        console.log(this.suggestions);
        
        this.suggestions = currentSuggestions;
      }else 
        this.suggestions = []
    });
    
  }

}
