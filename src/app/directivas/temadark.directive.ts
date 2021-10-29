import { Directive,ElementRef, Renderer  } from '@angular/core';

@Directive({
  selector: '[Temadark]'
})
export class TemadarkDirective {

  constructor(private element : ElementRef, private renderer : Renderer) { }

  ngOnInit(): void {

    this.renderer.setElementStyle( this.element.nativeElement, 'color', '#fff');
    this.renderer.setElementStyle( this.element.nativeElement, 'text-shadow', '1px 0 black, 0 1px black, 1px 0 black, 0 -1px black');
    this.renderer.setElementStyle( this.element.nativeElement,  'background-color', '#343a40')

    this.renderer.setElementStyle( this.element.nativeElement, 'font-family', "Roboto Slab, serif");
  
    // color: #fff;
    // background-color: #343a40;
    // border-color: #343a40;
    // font-family: 'Roboto Slab', serif;
  }

}
