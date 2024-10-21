import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hero, HeroModel } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;
  private storage: FirebaseStorage = getStorage();

  // private originalHeroesList = signal<Hero[]>([]); // signal que contiene todos los heroes
  // private heroesFiltered = signal<Hero[]>([]); // signal que se filtra
  // public heroesList = signal<Hero[]>([]); //signal que controla el estado

  public async uploadHeroImage(name: string, file: File | null): Promise<string> {
    const storageRef = ref(this.storage, name);
    const metadata = {
      contentType: file?.type
    };

    if(file) {
      let response = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
      return response
    }

    return '';
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl + '/heroes');
  }

  public originalHeroesList = signal<Hero[]>([]); // signal que contiene array de heroes original
  public heroesList = signal<Hero[]>([]); // signal que controla el estado de heroes

  getHeroesByAlias(alias: string) {
    if(alias.trim() == "") {
      this.heroesList.set(this.originalHeroesList());
    } else {
      const filteredHeroes = this.originalHeroesList().filter(hero =>
        hero.alias.toUpperCase().includes(alias.toUpperCase())
      );
      this.heroesList.set(filteredHeroes);
    }
  }

  addHero(hero: HeroModel): Observable<Hero> {
    console.log(hero);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HeroModel>(`${this.apiUrl}/heroes`, hero, { headers });
  }
}
