import { Injectable } from '@angular/core';
import { MovieByIdResponse } from './models/movieByIDResponse.model';
import { searchResponse } from './models/searchResponse.model';
@Injectable({
  providedIn: 'root'
})
export class OMDBService {
  private searchData;
  private searchTerm;
  private results;
  private totalResults: number = 0;
  private totalResultsFiltered: number = 0;
  private selectedMovie;
  private isThereMoreResults: boolean = false;
  
  constructor() { }
  async searchMovie (movie:String) {
    if(movie[movie.length-1] === ' ' || movie[0] === ' ')
      movie = movie.trim();
    
    this.searchTerm = movie
    const OMDPResponse = await fetch(`https://www.omdbapi.com/?s=${movie}&type=movie&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData:searchResponse = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;

    
  }

  async getNextPage(page) {
   
   const OMDPResponse = await fetch(`https://www.omdbapi.com/?s=${this.searchTerm}&page=${page}&type=movie&apikey=a285c6a9`);
      if(OMDPResponse.ok){
    const OMDPResponseData:searchResponse = await OMDPResponse.json();
      return OMDPResponseData;
  }else
      throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  async getMovieShortPlot(id:String) {
    // console.log(id);
    
    const OMDPResponse = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData:MovieByIdResponse = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  async getMovieLongPlot(id:String) {
    const OMDPResponse = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  setSearchData(data) {
    this.searchData = data;
  }
  getSearchData() {
    return this.searchData;
  }
  setSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
  }
  getSearchTerm() {
    return this.searchTerm;
  }

  setResults(results){
    this.results = results;
  }

  getResults(){
    return this.results;
  }

  setSelectedMovie(movie){
    this.selectedMovie = movie;
  }

  getSelectedMovie(){
    return this.selectedMovie;
  }

  setIsThereMoreResults(isThereMoreResults) {
    this.isThereMoreResults = isThereMoreResults;
  }

  getIsThereMoreResults(): boolean {
    return this.isThereMoreResults;
  }

  setTotalResults (numberOfResults:number) {
    this.totalResults = numberOfResults;
  }
  
  getTotalResults():number{
    return this.totalResults;
  }

  setTotalResultsFiltered (numberOfResultsFiltered:number) {
    this.totalResultsFiltered = numberOfResultsFiltered;
  }

  getTotalResultsFiltered(): number {
    return this.totalResultsFiltered;
  }

}
