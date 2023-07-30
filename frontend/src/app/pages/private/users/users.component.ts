import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('searchClear', { static: true }) searchClearElement!: ElementRef<HTMLElement>;
  @ViewChild('msg', { static: true }) msgElement!: ElementRef<HTMLElement>;
  @ViewChild('searchField', { static: true }) searchFieldElement!: ElementRef<HTMLElement>;

  // Array donde se almacenan los usuarios obtenidos
  userArray: any = [];

  // Variable para comprobar el email del usuario que esta en la lista
  appUser: string = '';


  // Form de búsqueda de usuarios
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  // Contador para la barra de búsqueda
  timer: any;

  // Variable que indica cuantas paginas deben haber
  page: number = 0;
  pageArray: Array<number> = [];
  numPage: number = 0;

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.getUsers(0);

    this.appUser = localStorage.getItem('email') || '';
  }

  ngAfterViewInit(): void {
    this.searchClearElement.nativeElement.style.display = 'none';
    this.msgElement.nativeElement.style.display = 'none';

    // Eventos para hacer que la busqueda se haga al pasar un tiempo solo y no hacer una peticion cada vez que se intriduce una letra
    this.searchFieldElement.nativeElement.addEventListener('keyup', () =>{
      clearTimeout(this.timer);
      this.timer = setTimeout(() =>{
        this.search();
      }, 1000)
    });

    this.searchFieldElement.nativeElement.addEventListener('keydown', () =>{
      clearTimeout(this.timer);
    });
  }

  getUsers(page: any){
    // Se hace la peticion al servicio de los usuarios para obtener la lista de estos
    this.userService.getUsers(page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userArray = res.users;

        this.page = Math.ceil(res.page.total / 10);
        console.log(this.page)
        for (let i = 0; i < this.page; i++) {
          this.pageArray.push(i+1);
        }

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  createUser(){
    this.router.navigateByUrl('/create-user');
  }

  updateUser(index: any){
    this.router.navigateByUrl(`/edit-user/${this.userArray[index].idUser}`);
  }

  deleteUser(index: any){
    // Se lanza un mensaje modal para que el usuario confirme si quiere eliminar al usuario seleccionado
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar usuario',
      text: 'Va a eliminar a este usuario. Esta acción no se puede revertir.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.userService.deleteUser(this.userArray[index].idUser).subscribe({
          next: (res: any) => {
            this.alertService.success('Usuario eliminado');

            // Se elimina el codigo del array
            this.userArray.splice(index, 1);
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error('Error al eliminar usuario');
          }
        })
      }
    });
  }

  // Funciones relacionadas con la barra de búsqueda
  search(){
    // Se comprueba que el fomrulario este correcto
    if(!this.searchForm.valid){
      return;
    }

    this.userService.getUserSearch(this.searchForm.value.searchQuery).subscribe({
      next: (res: any) =>{

        this.userArray = res.users;

        if(this.userArray.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No se han encontrado usuarios.';
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  cleanSearch(){
    this.searchForm.get('searchQuery')?.setValue('');
    this.checkSearch();
  }

  checkSearch(){
    // Cuando esta vacio
    if(this.searchForm.value.searchQuery === ''){
      // Se esconde el boton de limpiar el input
      this.searchClearElement.nativeElement.style.display = 'none';
      this.pageArray.splice(0);
      this.getUsers(0);
      this.msgElement.nativeElement.style.display = 'none';
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      this.searchClearElement.nativeElement.style.display = 'inline-block';
    }
  }

  pageUsers(page: any){
    if(page !== this.numPage){
      this.pageArray.splice(0);

      if(page > this.numPage) this.numPage ++;
      else this.numPage --;

      this.getUsers(page*10)
    }
  }

}
