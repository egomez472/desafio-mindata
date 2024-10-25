import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hero, HeroModel } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;
  private storage: FirebaseStorage = getStorage();

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  public originalHeroesList = signal<Hero[]>([]); // signal que contiene array de heroes original
  public heroesList = signal<Hero[]>([]); // signal que controla el estado de heroes

  public async uploadHeroImage(name: string, file: File | null): Promise<string> {
    try {
      const storageRef = ref(this.storage, name);
      const metadata = {
        contentType: file?.type
      };

      if(file) {
        let response = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
        return response
      }

      return '';
    } catch (error: any) {
      throw new Error(`Error subiendo imagen: ${error.message}`)
    }

  }

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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status} Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`)
    .pipe(
      catchError(this.handleError)
    );;
  }

  getHero(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/heroes/${id}`, { headers: this.headers })
  }

  addHero(hero: HeroModel): Observable<Hero> {
    return this.http.post<HeroModel>(`${this.apiUrl}/heroes`, hero, { headers: this.headers });
  }

  editHero(hero: Hero): Observable<Hero> {
    return this.http.put<HeroModel>(`${this.apiUrl}/heroes/${hero.id}`, hero, {headers: this.headers})
  }

  deleteHero(heroId: any): any {
    return this.http.delete<HeroModel>(`${this.apiUrl}/heroes/${heroId}`, {headers: this.headers});
  }
}
