import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ){}

  sidebarToggle(){
    this.document.body.classList.toggle( 'toggle-sidebar' );
  }

}
