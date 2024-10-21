import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UppercaseInputDirective } from './uppercase-input.directive';
import { Component, ElementRef } from '@angular/core';

@Component({
  template: `<input type="text" appUppercaseInput>`
})
class TestComponent {}

describe('UppercaseInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent], // Declaro el componente de prueba
      imports: [UppercaseInputDirective] // Importo la directiva standalone
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges(); // Disparo la detección de cambios

    // Accedo al input en el DOM del componente de prueba
    inputEl = fixture.nativeElement.querySelector('input'); // OPbtengo el input del DOM
  });

  it('should create an instance', () => {
    expect(inputEl).toBeTruthy(); // Aseguro que el input no es null
    const directive = new UppercaseInputDirective(new ElementRef(inputEl));
    expect(directive).toBeTruthy();
  });

  it('should convert input value to uppercase on input event', () => {
    expect(inputEl).toBeTruthy();

    inputEl.value = 'test';

    const event = new Event('input'); // Creo el evento input
    inputEl.dispatchEvent(event); // Disparo el evento

    fixture.detectChanges(); // Refresco el DOM después del evento
    expect(inputEl.value).toBe('TEST'); // Compruebo si el valor está en mayúsculas
  });

  it('should convert input value to uppercase on blur event', () => {
    expect(inputEl).toBeTruthy();

    inputEl.value = 'lowercase';

    const event = new Event('blur'); // Creo el evento blur
    inputEl.dispatchEvent(event); // Disparo el evento

    fixture.detectChanges(); // Refresco el DOM después del evento
    expect(inputEl.value).toBe('LOWERCASE'); // Compruebo si el valor está en mayúsculas
  });
});
