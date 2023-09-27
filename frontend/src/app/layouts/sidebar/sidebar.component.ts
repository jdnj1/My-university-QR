import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnChanges {

  @Input() role: number = 0;

  constructor(
    private userService: UserService,
  ){}

  ngOnInit(): void {

    this.getRole()

  }

  ngOnChanges(): void {
    this.getRole();
  }

  getRole(){
    let id = this.userService.getId();
    this.userService.getUserById(id).subscribe({
      next: (res: any) =>{
        this.role = res.user.role;
      }
    });
  }

  logout(){
    this.userService.logout();
  }

}
