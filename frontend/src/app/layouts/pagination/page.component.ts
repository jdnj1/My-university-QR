import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, OnChanges{
  @Input() pageTotal: number = 0;
  @Output() eventArray = new EventEmitter<any>();

  numPage: number = 0;
  pageArray: Array<number> = [];
  itemPerPag: number = environment.recordsByPage;
  page: number = 0;



  constructor(){}

  ngOnInit(): void {
    this.getPages();
  }

  ngOnChanges(): void {
    this.getPages();
  }


  getPages(){
    // Se calcula el numero de paginas que debe haber
    this.page = Math.ceil(this.pageTotal / this.itemPerPag);

    // Si se elimina el ultimo elemento de una pagina
    if(this.page !== 0 && this.page === this.numPage){
      this.numPage -= 1;
    }

    this.pageArray = [];
    for (let i = 0; i < this.page; i++) {
      this.pageArray.push(i+1);
    }

    this.eventArray.emit(this.numPage);
  }

  pageQr(page: any){
    if(page !== this.numPage){

      this.numPage = page;

      this.eventArray.emit(page);

    }
  }

}
