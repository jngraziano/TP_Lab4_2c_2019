import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  perfilUsuario: string; 
  dish: boolean=true;
  promotion: boolean=true;
  images = [  
    // { img: "./assets/images/uthappizza.png" },  
    // { img: "./assets/images/interior.jpg" },  
    // { img: "./assets/images/buffet.png" }  
    { img: "./assets/images/yoelijovotar2.png" },
    { img: "./assets/images/UrnaVoto.jpg" },
    { img: "./assets/images/yoelijovotar3.png" }

    // { img: "../assets/images/4.jpg" },  
    // { img: "../assets/images/5.jpg" },  
    // { img: "../assets/images/6.jpg" },  
    // { img: "../assets/images/7.jpg" },  
    // { img: "../assets/images/8.jpg" },  
    // { img: "../assets/images/9.jpg" },  
  ];  
  
  slideConfig = {  
    "slidesToShow": 1,  
    "slidesToScroll": 1,  
    "dots": true,  
    "autoplay": true,
    "infinite": true  
  };  

  // promotion: Promotion;
  // leader: Leader;
  constructor() { }

  ngOnInit() {

    if(localStorage.getItem('usuario') == null )
    {
      // console.log("no hay usuario");
    }
    else 
    {
      this.perfilUsuario = JSON.parse(localStorage.getItem('usuario')).perfil;
    }
  }

  

}
