import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public isLoading = signal<boolean>(false);

  show() {
    this.isLoading.set(true);
    return true;
  }

  hide() {
    this.isLoading.set(false);
    return false;
  }
}
