export interface searchResponse{
    Search: [{
        Title: string,
        Year: string,
        imdbID: string,
        Type: string,
        Poster: string
      }],
      totalResults: number,
      Response: string
}