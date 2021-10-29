import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '../../clases/usuario';
// import { UsuariosService } from "../services/usuarios.service";
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as firebase from "firebase";

// import { AngularFireStorage } from 'angularfire2/storage';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

// import { MessageService } from 'primeng/api';
// import {Message} from 'primeng/components/common/api';

// export interface DetalleUsuarios {
//   usuario: string;
//   perfil: string;
//   estado: string;
//   accionesSusp: any;
//   accionesDel: any;
// }

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  
})

export class UsuariosComponent implements OnInit {

  // @Input() dataSource;

  listaUsuarios:Array<any>;
  usuarioRegistrado: boolean = false;
  agregOK:boolean = false;
  eliminOK:boolean = false;
  perfiles = [
    {name: 'admin'},
    {name: 'presidente'},
    {name: 'funcionario'},
    {name: 'auxiliar'},
    {name: 'fiscal'},
    {name: 'votante'}

  ];
  selectedFile: ImageSnippet;
  imagenNueva: any;
  checkagregoimagen: boolean = false;
  agregoimagenErrorMsg: boolean = false;

  
  // displayedColumns: string[] = ['usuario', 'perfil', 'estado','accionesSusp','accionesDel'];


  // private msjServ: MessageService
  // private usrService: UsuariosService, private httpUsuarios:UsuariosService
  constructor( private builder: FormBuilder,
    private baseService:FirebaseService, 
    // private afStorage: AngularFireStorage
   ) {
    this.TraerTodosLosUsuarios();
   }

   email = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  
  clave = new FormControl('', [
    Validators.required
  ]);

  perfil = new FormControl(null, [
    // null
    // Validators.required
  ]);
  

  sexo = new FormControl('');


  registroForm: FormGroup = this.builder.group({
    email: this.email,
    clave: this.clave,
    sexo: this.sexo,
    perfil: this.perfil
   
  });


   TraerTodosLosUsuarios()
   {

//    this.httpUsuarios.TraerUsuarios().subscribe(data=>{
//     this.listaUsuarios= JSON.parse(data._body);
//    // console.log(this.listaUsuarios);
    
//  });

this.baseService.getItems("votar/Usuarios").then(users => {
  // setTimeout(() => this.spinner = false, 2000);
  
  this.listaUsuarios = users;
  

});
   }
  


   IngresarUsuario()
   {
 

        let sexoOK= this.registroForm.get('sexo').value;
        if(sexoOK == undefined || sexoOK == '')
        {
          sexoOK = "hombre";
        }
                                                      
        let usuarioNuevo = 
        {
          username : this.registroForm.get('email').value,
        
        }

        let usuarioLogueado = this.listaUsuarios.find(elem => (elem.username == usuarioNuevo.username));
        if (usuarioLogueado != undefined) {

          this.usuarioRegistrado = true;
        }
        else{
          if(this.checkagregoimagen)
          {
            this.agregarImagen();
            let imagen:string = localStorage.getItem("ImagenSeleccionada");
            console.log(imagen);
            let usuarioNuev = new Usuario(this.registroForm.get('email').value,this.registroForm.get('clave').value,
            this.registroForm.get('perfil').value,sexoOK,imagen);
            console.log(usuarioNuev); 
            this.baseService.addItem('votar/Usuarios', usuarioNuev); 
            this.usuarioRegistrado = false;
            this.agregoimagenErrorMsg = false;
            this.eliminOK = false;
            this.agregOK = true;
            localStorage.setItem("ImagenSeleccionada","");

            this.registroForm.reset();
            
          }
          else{
            this.agregoimagenErrorMsg = true;
          }
          
          this.TraerTodosLosUsuarios();
        }


      
        // this.httpUsuarios.CargarUsuario(usuario, clave, sexo, perfil)
        // .subscribe((data)=>{
        //  // console.log(data);
        //   this.TraerTodosLosUsuarios();
        // })
        // ;
        
  
      

       
   }

   descarga(){
    this.eliminOK = false;
    const documentDefinition = { content: [
        {
            text: 'Listado de Usuarios',
            bold: true,
            fontSize: 20,
            alignment: 'center',
            decoration: 'underline',
            margin: [0, 0, 0, 20]
        },
        this.getListaUsuariosPDF(),
    
      ],
          styles: {
            name: {
              fontSize: 14,
            },
            jobTitle: {
              fontSize: 16,
              bold: true,
              italics: true
            }
          }
        }

    
    pdfMake.createPdf(documentDefinition).download('ListadoUsuarios.pdf');
  
  }
  getListaUsuariosPDF(){
    const exs = [];
    this.listaUsuarios.forEach(element => {
      exs.push(
        [{
          columns: [
            [{
              text: "Username: "+ element.username,
              style: 'jobTitle'
            },
            {
              text:  "Estado: "+ element.estado,
              style: 'name'
            },
            {
              text:  "Perfil: "+ element.perfil,
              style: 'name'
            },
            {
              text:  "Sexo: "+ element.sexo,
              style: 'name'
            },
            {
              text:  "Firebase Key: "+ element.key,
              style: 'name'
            },
          ]
          ]
        }]
      );
    });
    return {
      table: {
        widths: ['*'],
        body: [
          ...exs
        ]
      }
    };
  
  }


  suspender(item){
    this.baseService.getItems("votar/Usuarios").then(users => {
      // setTimeout(() => this.spinner = false, 2000);
      
     let listausuarios = users;
   
      let usuarioLogueado = listausuarios.find(elem => (elem.username == item.username));

      console.log(usuarioLogueado);
      // console.log(usuarioLogueado);
      // console.log(this.cuenta);

      let objetoEnviar = {
                         
        "estado": "suspendido"

      }
      this.baseService.updateItem('votar/Usuarios', usuarioLogueado.key, objetoEnviar); 
      this.TraerTodosLosUsuarios();
    });
    
  }

  activar(item){
    this.baseService.getItems("votar/Usuarios").then(users => {
      // setTimeout(() => this.spinner = false, 2000);
      
     let listausuarios = users;
   
      let usuarioLogueado = listausuarios.find(elem => (elem.username == item.username));

      console.log(usuarioLogueado);
      // console.log(usuarioLogueado);
      // console.log(this.cuenta);

      let objetoEnviar = {
                         
        "estado": "activo"

      }
      this.baseService.updateItem('votar/Usuarios', usuarioLogueado.key, objetoEnviar); 
      this.TraerTodosLosUsuarios();
    });
  }

  borrarUsuario(usuario){
    console.log(usuario);
    this.baseService.removeItem('votar/Usuarios', usuario.key );

    this.agregOK = false;
    this.eliminOK = true;
    this.TraerTodosLosUsuarios();
  }

  processFile(imageInput){

    this.imagenNueva = imageInput;
    this.checkagregoimagen = true; 
  }
   
  agregarImagen()
  {
    let storageRef = firebase.storage().ref();
    let errores: number = 0;
    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('Usuarios'));
    let filename: string = this.registroForm.get('email').value;
    const file: File = this.imagenNueva.files[0];
    const reader = new FileReader();
    const imageRef = storageRef.child(`votar/Usuarios/${filename}.jpg`);
    let enviarFotoB64;

    reader.onloadend = function() {
      enviarFotoB64= reader.result;
      localStorage.setItem("ImagenSeleccionada",enviarFotoB64)
      
      imageRef.putString(enviarFotoB64, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
       
      })
        .catch(() => {
          errores++;
        });
    }
    
    reader.readAsDataURL(file);
  }


  ngOnInit() {
    this.TraerTodosLosUsuarios();
  }



}
