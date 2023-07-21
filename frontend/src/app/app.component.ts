import { Component } from '@angular/core';
import { ActivationEnd, ActivationStart, NavigationStart, Router } from '@angular/router';
import { Error404Component } from './pages/public/error404/error404.component';

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
      //console.log(event)
      if( event instanceof NavigationStart ){
        //console.log(event)
        if(event.url !== '/'){
          this.header = true;
          this.sidebar = true;
        }
        else{
          this.header = false;
          this.sidebar = false;
        }
      }

      if (event instanceof ActivationEnd ){
        console.log(event)
        if(event.snapshot.component === Error404Component){
          this.header = false;
          this.sidebar = false;
        }
      }
    });
  }

}
