import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router} from '@angular/router';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {Usuario} from '../../clases/usuario';
import { MatDialog, MatDialogRef} from '@angular/material';
import { FirebaseService } from '../../servicios/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  datacallback: string;
  public dataRespuesta:any;
  respuesta: any;
  hide: any;
  @Input () type: any;
  usuarios:any[];
  datosLogin: Usuario;
  public error: boolean = false;
  public success: boolean = false;

  isLoading: boolean = false;
  captchaOK:boolean = false;
  captchaE:boolean = false;
  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;
 

  constructor(
      private formBuilder: FormBuilder,
      private baseService:FirebaseService,
      private router: Router,
      // private _login: LoginService,
      private dialog: MatDialog
      //private authenticationService: AuthenticationService,
      //private alertService: AlertService
      ) {
     
      }

  ngOnInit() {
   
      this.addRecaptchaScript();

      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      

    }

    get f() { return this.loginForm.controls; }




Entrar(){ 
  
    this.submitted = true;
    this.loading = true;
    
    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //     return;
    // }
   
    // this.datosLogin = new Usuario(this.f.username.value, this.f.password.value);
    // this.datosLogin = new Usuario(this.datosLogin.username, this.datosLogin.password);


    // this._login.ServiceLogin(datosLogin)
    // .subscribe( data =>{


    //   this.respuesta = JSON.parse(data._body);

    //   if (this.respuesta)
    //   {
    //     localStorage.setItem('data', JSON.stringify(this.respuesta) );
    //     localStorage.setItem('usuario', JSON.stringify(this.respuesta.datos) );
        
    //     localStorage.setItem('token', JSON.stringify(this.respuesta.token) );
    //     this.dialog.closeAll();
    //     if(this.respuesta.datos.perfil =='admin')
    //     {
    //       this.router.navigate(['usuarios']); 
    //     }
    //     else
    //     {
    //       if(this.respuesta.datos.perfil =='mozo')
    //       {
    //         this.router.navigate(['menu']); 
    //       }
    //       else
    //       { 
    //         if(this.respuesta.datos.perfil =='cliente')
    //         {
    //           this.router.navigate(['cliente']); 
    //         }
    //         else
    //         { 
    //           this.router.navigate(['listado']); 
    //         }
    //       }
    //     }
       
    //   }
    //   else{
    //     alert("error");
    //     this.router.navigate(['home']); 
    //   }

     
    // });
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 8000);
    this.baseService.getItems("comanda/Usuarios").then(users => {
      // setTimeout(() => this.spinner = false, 2000);
      
      this.usuarios = users;
   
      let usuarioLogueado = this.usuarios.find(elem => (elem.username == this.f.username.value && elem.password == this.f.password.value));

      console.log(usuarioLogueado);
      // let usuarioGuardaSesion = {
      //     estado: usuarioLogueado.estado,
      //     key: usuarioLogueado.key,
      //     password: usuarioLogueado.password,
      //     perfil: usuarioLogueado.perfil,
      //     sexo: usuarioLogueado.sexo,
      //     username: usuarioLogueado.username
      // }
    
      if (usuarioLogueado !== undefined) {
        this.error = false;
        // this.success = true;
        sessionStorage.setItem('Usuarios', JSON.stringify(usuarioLogueado));

        // this.events.publish('usuarioLogueado', usuarioLogueado.perfil);       
        // this.creoToast(true);
        console.log("Captcha esta ok?" + this.captchaOK);
        if (this.captchaOK) {
          this.isLoading = false;
          this.captchaE = false;
          this.dialog.closeAll();
          if(usuarioLogueado.perfil == "admin")
          {
            // this.isLoading = false;
            this.router.navigateByUrl('/usuarios'); 
          }
          else if (usuarioLogueado.perfil == "cliente") {
            // this.isLoading = false;
            this.router.navigateByUrl('/cliente'); 
          }
          else
              { 
               
                this.router.navigateByUrl('/listado'); 
              }
       
          
        }
        else{
          this.isLoading = false;
          this.captchaE = true;
          

      }
      
        
      }
      else{
        this.isLoading = false;
        this.error = true;
        
      }
    });
  
}

LoginSocio()
{
    this.loginForm.controls['username'].setValue('admin@gmail.com');
    this.loginForm.controls['password'].setValue('admin');
}

LoginCliente()
{
    this.loginForm.controls['username'].setValue('cliente1@gmail.com');
    this.loginForm.controls['password'].setValue('1234');
}

LoginMozo()
{
  this.loginForm.controls['username'].setValue('mozo@gmail.com');
  this.loginForm.controls['password'].setValue('1234');
}

LoginTragos()
{
  this.loginForm.controls['username'].setValue('barra1@gmail.com');
  this.loginForm.controls['password'].setValue('1234');
}


LoginChopera()
{
  this.loginForm.controls['username'].setValue('chopera1@gmail.com');
  this.loginForm.controls['password'].setValue('1234');
}

LoginCocina()
{
  this.loginForm.controls['username'].setValue('cocina1@gmail.com');
  this.loginForm.controls['password'].setValue('1234');
}

LoginCandy()
{
  this.loginForm.controls['username'].setValue('candy1@gmail.com');
  this.loginForm.controls['password'].setValue('1234');
}

renderReCaptch() {
  window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
    'sitekey' : '6LcNY78UAAAAANCSxOs6q84fn-fdu3x5fzSzmZWD',
    'callback': (response) => {
      this.captchaOK = true;
        // console.log(response);
        console.log(this.captchaOK);
    }
  });
}

addRecaptchaScript() {

  window['grecaptchaCallback'] = () => {
    this.renderReCaptch();
  }

  (function(d, s, id, obj){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { obj.renderReCaptch(); return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'recaptcha-jssdk', this));

}



}
