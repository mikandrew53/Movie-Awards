import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OMDPService {

  constructor() { }

  async searchMovie (movie:string) {
    const OMDPResponse = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=a285c6a9`);

    // const weatherResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`);
    // const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${this.woeid}/`);
    if(OMDPResponse.ok){
        const OMDPResponseData = await OMDPResponse.json();
        return OMDPResponseData;
    }else
        throw `Error: ${OMDPResponse.status} ${OMDPResponse.statusText}`;
}
}
