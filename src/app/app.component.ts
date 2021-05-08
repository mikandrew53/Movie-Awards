import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LibraryService } from './library.service';
interface libraryItem {
  img: string,
  hide: boolean,
  imdbID: string,
  name: string,
  year: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navActive: boolean = false;
  libraryUi: Array<libraryItem> = []
  tempLibrary = [];
  @ViewChild('label', {static: true}) labelUI: ElementRef;
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === "Escape")
      this.close();
  }

  constructor(private library:LibraryService){}
  

  ngOnInit(): void {
    if(this.library.getLibrary().length !== 0){
      for(let i = 0; i < this.library.getLibrary().length; i++){
        this.libraryUi.push( {
          img: this.library.getLibrary()[i].img,
          hide: false,
          imdbID: this.library.getLibrary()[i].imdbId,
          name: this.library.getLibrary()[i].name,
          year: this.library.getLibrary()[i].year
        });
      }
    }
    
    this.library.libChanged.subscribe((movie) => {
      this.libraryUi.push({
        img: movie.img,
        hide: false,
        imdbID: movie.imdbID,
        name: movie.name,
        year: movie.year
      });
    });

    this.library.movieRemoved.subscribe(data => {
        if(!data.removedFromLibrary){
          for(let i = 0; i < this.libraryUi.length; i++){
            if(this.libraryUi[i].imdbID === data.imdbID){
                this.libraryUi.splice(i, 1);
              break;
            }
          }
        }
    });
  }

  removeFromLibrary(i){
    this.libraryUi[i].hide = true;
    this.library.removeFromLibrary(this.libraryUi[i].imdbID, true);
    setTimeout(() => this.libraryUi.splice(i, 1), 400);
    ;
  }
  
  closeAnimation() {
    document.body.style.overflowY = 'auto';
    this.navActive = false;
  }

  open() {
    this.navActive = true;
    document.body.style.overflowY = 'hidden';
  }
  close(delay?: boolean) {
    delay ? setTimeout(() => this.closeAnimation(), 150) : this.closeAnimation();
  }
  toggle(){
    this.navActive ? this.close() : this.open();
    if(this.navActive){
      document.getElementById('label').style.transform = 'translateX(-310px) rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = 'translateX(-310px)';
    }
    else{
      document.getElementById('label').style.transform = 'translateX(0px) rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = 'translateX(0px)';
    }
  }
  
  onHover() {
    if(!this.navActive){
      document.getElementById('label').style.transform = 'translateX(-10px) rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = 'translateX(-10px)';
    }
    else {
      document.getElementById('label').style.transform = 'translateX(-300px) rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = 'translateX(-300px)';
    }
  }

  onMouseLeave() {
    if(!this.navActive){
      document.getElementById('label').style.transform = 'rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = '';
    }
    else {
      document.getElementById('label').style.transform = 'translateX(-310px) rotate(180deg)';
      document.getElementById('numberOfMovies').style.transform = 'translateX(-310px)';
    }
  }
}
