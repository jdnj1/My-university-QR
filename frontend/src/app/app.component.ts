import { Component } from '@angular/core';
import { ActivationEnd, ActivationStart, NavigationStart, Router } from '@angular/router';
import { Error404Component } from './pages/public/error404/error404.component';
import { TranslateService } from '@ngx-translate/core';
import { ViewComponent } from './pages/public/view/view.component';
import { UserService } from './services/user.service';

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

  role: number = 0;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService
    ){
      this.translateService.setDefaultLang('es');
    }

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

        if(event.url === '/users-list'){
          this.role = this.userService.role;
        }
      }

      if (event instanceof ActivationEnd ){
        if(event.snapshot.component === Error404Component || event.snapshot.component === ViewComponent){
          this.header = false;
          this.sidebar = false;
        }
      }
    });
  }

}
