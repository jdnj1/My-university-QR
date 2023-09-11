import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  role: number = 0;

  constructor(
    private userService: UserService,
  ){}

  ngOnInit(): void {
    // console.log(this.userService.getUserData())
    // this.role = this.userService.role;

    let token = localStorage.getItem('token') || '';
    let user: any = jwt_decode(token);
    this.role = user.role;

  }

  logout(){
    this.userService.logout();
  }

}
