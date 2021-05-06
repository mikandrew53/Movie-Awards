import { Component, HostListener } from '@angular/core';
import { LibraryService } from './library.service';
interface libraryItem {
  img: string,
  hide: boolean,
  imdbID: string
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
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === "Escape")
      this.close();
  }

  constructor(private library:LibraryService){}
  

  ngOnInit(): void {
    console.log(this.library.getIndex());
    
    if(this.library.getIndex() != 0){
      for(let movieId in this.library.getLibrary()){
        this.libraryUi.push( {
          img: this.library.getLibrary()[movieId],
          hide: false,
          imdbID: movieId
        });
      }
    }
    
    
    this.library.libChanged.subscribe((movie) => {
      this.libraryUi.push({
        img: movie.img,
        hide: false,
        imdbID: movie.imdbID
      });
      });

      this.library.movieRemoved.subscribe(data => {
        if(!data.removedFromLibrary){
          console.log('Removed From Library');
          
          for(let i = 0; i < this.libraryUi.length; i++){
            if(this.libraryUi[i].imdbID === data.imdbID){
                this.libraryUi.splice(i, 1);
              break;
            }
          }
        }
      })
    }
    
    ngAfterViewInit(): void {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      // console.log(this.libraryUi[0]);
    //Add 'implements AfterViewInit' to the class.
      // this.libraryUi = this.tempLibrary;
  // }
  }


  removeFromLibrary(i){
    console.log(this.libraryUi);
    this.libraryUi[i].hide = true;
    this.library.removeFromLibrary(this.libraryUi[i].img, true);
    setTimeout(() => this.libraryUi.splice(i, 1), 400);
    ;
  }
  
  closeAnimation() {
    // this.links.forEach((link: HTMLElement) => link.style.animation = '' );
      // this.profile.nativeElement.style.animation = '';
      document.body.style.overflowY = 'auto';
      this.navActive = false;
  }

  open() {
    // this.profile.nativeElement.style.animation = `navLinkFade 0.5s ease forwards 0s`
    // this.links.forEach((link: HTMLElement, index) => link.style.animation = `navLinkFade 0.5s ease forwards ${(index + 1)/ 12}s`);
    this.navActive = true;
    document.body.style.overflowY = 'hidden';
  }
  close(delay?: boolean) {
    delay ? setTimeout(() => this.closeAnimation(), 150) : this.closeAnimation();
  }
  toggle(){
    this.navActive ? this.close() : this.open();
  }
  
  overlayClick(){
    if (!this.navActive) return;
    this.close();
  }
}
