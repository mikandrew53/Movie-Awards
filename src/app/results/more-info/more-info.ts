import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OMDPService } from 'src/app/OMDP.service';

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
  director: string
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

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.html',
  styleUrls: ['./more-info.scss']
})
export class MoreInfoComponent implements OnInit {
  movie:movie
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any, private OMDB: OMDPService) { }
  constructor() { }

  ngOnInit(): void {
    // this.movie = this.data.movie;
    // this.OMDB.getMovieShortPlot(this.movie.imdbID)
    // .then((data:responseData) => {
    //   console.log(data);
    //   if(data.Response === "True"){
    //     if(data.Actors !== 'N/A')
    //       this.movie.actors = data.Actors;
    //     if(data.Plot !== 'N/A' )
    //       this.movie.plot = data.Plot;
    //     if(data.Language !== 'N/A')
    //       this.movie.language = data.Language;
    //     if(data.Year !== 'N/A')
    //       this.movie.year = data.Year;
    //     if(data.imdbRating !== 'N/A')
    //       this.movie.rated = data.imdbRating;
    //     if(data.Released !== 'N/A')
    //       this.movie.releaseDate = data.Released;
    //     if(data.Runtime !== 'N/A')
    //       this.movie.runtime = data.Runtime;
    //     if(data.Genre !== 'N/A')
    //       this.movie.genre = data.Genre;
    //     if(data.Director !== 'N/A')
    //       this.movie.director = data.Director;
    //   }
    // })    
  }

}
