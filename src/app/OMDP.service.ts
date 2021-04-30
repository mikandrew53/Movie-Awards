import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OMDPService {
  private searchData;
  private searchTerm;

  constructor() { }

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

  async searchMovie (movie:string) {
    const OMDPResponse = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=a285c6a9`);
    if(OMDPResponse.ok){
        const OMDPResponseData = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
  }


}
