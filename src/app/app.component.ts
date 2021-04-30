import { Component, HostListener } from '@angular/core';
import { OMDPService } from './OMDP.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navActive: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === "Escape")
      this.close();
  }
  constructor(private OMDP: OMDPService){
    OMDP.searchMovie('Star wars')
    .then(data => console.log(data)
    );
  }

  ngOnInit(): void {
    
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
