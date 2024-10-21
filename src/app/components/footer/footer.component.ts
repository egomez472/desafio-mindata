import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  navigate(url: string) {
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  }

}
