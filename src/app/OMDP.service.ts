import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OMDPService {
  private searchData;
  private searchTerm;
  private results;
  private selectedMovie;
  private isThereMoreResults: boolean = false;

  constructor() { }
  async searchMovie (movie:string) {
    if(movie[movie.length-1] === ' ' || movie[0] === ' ')
      movie = movie.trim();
    
    this.searchTerm = movie
    const OMDPResponse = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  async getNextPage(page) {
   
   const OMDPResponse = await fetch(`http://www.omdbapi.com/?s=${this.searchTerm}&page=${page}&apikey=a285c6a9`);
      if(OMDPResponse.ok){
    const OMDPResponseData = await OMDPResponse.json();
      return OMDPResponseData;
  }else
      throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  async getMovieShortPlot(id:string) {
    const OMDPResponse = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }

  async getMovieLongPlot(id:string) {
    const OMDPResponse = await fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=a285c6a9`);
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

  getIsThereMoreResults() {
    return this.isThereMoreResults;
  }



}
