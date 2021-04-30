import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navActive: boolean = false;


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
