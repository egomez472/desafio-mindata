import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HeroModel } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;
  private storage: FirebaseStorage = getStorage();

  public async uploadHeroImage(name: string, file: File) {
    const storageRef = ref(this.storage, name);

    const metadata = {
      contentType: file.type
    };

    let response = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
    return response
  }

  getHeroes(): Observable<HeroModel[]> {
    return this.http.get<HeroModel[]>(this.apiUrl + '/heroes');
  }
}
