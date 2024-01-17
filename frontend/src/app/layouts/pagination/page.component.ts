import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginationService } from 'src/app/services/pagination.service';
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


  constructor(
    private paginationService: PaginationService
  ){}

  ngOnInit(): void {
    this.numPage = this.paginationService.getPos();
    this.getPages();
  }

  ngOnChanges(): void {
    this.getPages();
  }


  getPages(){
    // Se calcula el numero de paginas que debe haber
    this.page = Math.ceil(this.pageTotal / this.itemPerPag);

    this.pageArray = [];
    for (let i = 0; i < this.page; i++) {
      this.pageArray.push(i+1);
    }
  }

  pageQr(page: any){
    if(page !== this.numPage){
      this.numPage = page;
      this.paginationService.setPos(this.numPage);
      this.eventArray.emit(page);
    }
  }

  deleteLast(){
    // Se controla que si se elimina el ultimo elemento de la pagina salte a la anterior
    if(this.pageTotal != 1 && this.pageTotal === this.itemPerPag * this.numPage + 1){
      this.numPage -= 1;
      this.paginationService.setPos(this.numPage);
    }
    this.eventArray.emit(this.numPage);
  }

}
