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
    this.role = this.userService.getRole();
  }

  logout(){
    this.userService.logout();
  }

}
