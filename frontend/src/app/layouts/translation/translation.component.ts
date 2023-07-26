import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { env } from 'echarts';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {

  // Variable que indica el idioma activo en ese momento
  activeLang = 'es';

  langs: any = environment.langs;

  constructor(
    private translateService: TranslateService
  ){
    // Establece un lenguaje por defecto, en ese caso el Español
    this.translateService.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {

  }

  changeLang(event: any){
    this.activeLang = event.target.value;
    this.translateService.use(event.target.value);
  }
}
