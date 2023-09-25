import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {
  @Input() page: number = 0;
  @Input() pageArray: Array<number> = [];
  @Output() eventArray = new EventEmitter<any>();

  numPage: number = 0;



  constructor(){}

  pageQr(page: any){
    console.log(page);
    if(page !== this.numPage){
      this.pageArray.splice(0);

      this.numPage = page;

      this.eventArray.emit(page);

    }
  }

}
