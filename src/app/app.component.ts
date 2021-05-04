import { Component, HostListener } from '@angular/core';
import { LibraryService } from './library.service';
interface libraryItem {
  img: string,
  hide: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navActive: boolean = false;
  libraryUi: Array<libraryItem> = []

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === "Escape")
      this.close();
  }

  constructor(private library:LibraryService){}
  

  ngOnInit(): void {
    // this.libraryUi = this.library.getLibrary();
    this.library.libChanged.subscribe((imgUrl) => {
      this.libraryUi.push({
        img: imgUrl,
        hide: false });
    });
  }

  removeFromLibrary(i){
    console.log(this.libraryUi);
    this.libraryUi[i].hide = true;
    this.library.removeFromLibrary(this.libraryUi[i].img);
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
