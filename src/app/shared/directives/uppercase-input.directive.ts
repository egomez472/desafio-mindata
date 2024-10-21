import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {

  constructor(private el: ElementRef) {}

  // Escucho el evento input para cuando se escribe
  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Convierto el valor del input a mayúsculas
    input.value = input.value.toUpperCase();
  }

  // También manejo el evento de blur para asegurarme que el valor
  // quede en mayúsculas cuando salgo del input
  @HostListener('blur') onBlur() {
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

}
