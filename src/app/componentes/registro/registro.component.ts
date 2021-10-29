import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FirebaseService } from '../../servicios/firebase.service';
import { Usuario } from "../../clases/usuario";

import * as firebase from "firebase";

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuarioUtilizado: boolean = false;
  contraError: boolean = false;
  agregado: boolean = false;
  faltancampos: boolean = false;
  emailincompleto: boolean = false;
  listadoUsuarios:any=[];
  isLoading: boolean = false;

  public cuentaRegistro  =
  {
    "username" : "",
    "password" : "",
    "passwordR" : ""


  }

  sexoElegido:string = "hombre";
  radioSelected:string;

  selectedFile: ImageSnippet;
  imagenNueva: any;
  checkagregoimagen: boolean = false;
  agregoimagenErrorMsg: boolean = false;

  constructor(private baseService:FirebaseService ) { }

  ngOnInit() {
  }

  registrarme(){
    this.agregado = false;
    this.usuarioUtilizado = false;
    this.emailincompleto = false;
    if(!this.validateEmail(this.cuentaRegistro.username))
    {
      this.emailincompleto = true;
    }
    else{
      this.emailincompleto = false;
    }
    if (this.cuentaRegistro.username == "" || this.cuentaRegistro.password == "" ||
        this.cuentaRegistro.passwordR == "") {
          this.faltancampos = true;
          
    }
    else{
      this.faltancampos = false;
    }

    if(this.cuentaRegistro.password != this.cuentaRegistro.passwordR)
    {
      this.contraError = true;
    }
    else{
      this.contraError = false;
    }
  
    if(this.faltancampos == false && this.contraError == false && this.emailincompleto == false )
    {
      this.isLoading = true;
    
      this.baseService.getItems("comanda/Usuarios").then(users => {
     
        this.listadoUsuarios = users;
  
        let usuarioLogueado = this.listadoUsuarios.find(elem => (elem.username == this.cuentaRegistro.username));
        console.log(usuarioLogueado);
     
        if (usuarioLogueado !== undefined) {
          this.usuarioUtilizado = true;
          this.isLoading = false;
          
        }
        else{
          if(this.checkagregoimagen)
          {
            this.agregarImagen();
            let imagen:string = localStorage.getItem("ImagenSeleccionada");
            console.log(imagen);
            this.usuarioUtilizado = false;
         
            let usuarioNuev = new Usuario(this.cuentaRegistro.username,
                                          this.cuentaRegistro.password,
                                          "cliente",
                                          this.sexoElegido,
                                          imagen);
          this.baseService.addItem('comanda/Usuarios', usuarioNuev); 
          this.cuentaRegistro.username= "";
          this.cuentaRegistro.password= "";
          this.cuentaRegistro.passwordR= "";
          this.isLoading = false;
          this.agregado = true;
          localStorage.setItem("ImagenSeleccionada","");

          }
          else{
            this.isLoading = false;
            this.agregoimagenErrorMsg = true;
          }
          
  
          
        }
    
    
    });
    }
    
  
  }
  agregarImagen()
  {
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('Usuarios'));
    let filename: string = this.cuentaRegistro.username;
    const file: File = this.imagenNueva.files[0];
    const reader = new FileReader();
    const imageRef = storageRef.child(`comanda/usuarios/${filename}.jpg`);
    let enviarFotoB64;

    reader.onloadend = function() {
      enviarFotoB64= reader.result;
      localStorage.setItem("ImagenSeleccionada",enviarFotoB64);
      
      imageRef.putString(enviarFotoB64, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
       
      })
        .catch(() => {
          errores++;
        });
    }
    
    reader.readAsDataURL(file);
  }

  processFile(imageInput){

    this.imagenNueva = imageInput;
    this.checkagregoimagen = true; 
  }


    validateEmail(email) {
    // let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
}

onItemChange(value)
{
  this.sexoElegido=value;
}

}
