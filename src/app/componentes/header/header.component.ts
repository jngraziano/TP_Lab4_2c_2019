import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() usuario: any;
  @Input() perfil: any;
  @Output() emiterHeader:EventEmitter<any> = new EventEmitter();

  IngresoBool:boolean;
  perfilUsuario:string;
  nombre:string;
  dialogAbierto:boolean = false;

  constructor(private dialog: MatDialog,   private router: Router) { }

  ngOnInit() {
    if(sessionStorage.getItem('Usuarios') == null )
    {
    //  console.log("no hay usuario");
      this.IngresoBool=false;
      this.nombre='';
    }
    else 
    {
      this.usuario = JSON.parse(sessionStorage.getItem('Usuarios')) ;
      this.nombre =this.usuario.username;
      this.IngresoBool=true;
      this.perfilUsuario = JSON.parse(sessionStorage.getItem('Usuarios')).perfil;
    }

  }

  openLoginForm(){
    if(this.dialogAbierto)
    {
      this.dialog.closeAll();

      this.dialogAbierto = false;

    }
    else{
      this.dialog.open(LoginComponent, {hasBackdrop: true, disableClose: false, width:'100%', height:'20%',panelClass: 'midialogEdit' });

      this.dialogAbierto = true;
    }
    
  }

  logout()
  {
    sessionStorage.clear();
    this.IngresoBool=false;
    this.router.navigate(['']);
    
  }

}
