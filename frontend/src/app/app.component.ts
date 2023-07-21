import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  //Para comprobar si se tienen que renderizar los componentes
  header: boolean = false;
  sidebar: boolean = false;

  constructor(
    private router: Router,
    ){}

  ngOnInit(){
    // Comprobamos si tenemos que renderrizar los componentes
    this.router.events.subscribe( ( event: any ) => {
      if( event instanceof NavigationStart ){
        // console.log(event)
        if(event.url !== '/'){
          this.header = true;
          this.sidebar = true;
        }
      }
    });
  }

}
