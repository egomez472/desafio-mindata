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
      if(file) {
        let response = await this.uploadBytesFn(name, file);
        return response
      }
      return '';
    } catch (error: any) {
      throw new Error(`Error subiendo imagen: ${error.message}`)
    }
  }

  async uploadBytesFn(name: string, file: File) {
    const storageRef = ref(this.storage, name);
    const metadata = {
      contentType: file?.type
    };
    const urlDownload = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
    return urlDownload;
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
    let errorMessage = 'Unknown error';
    if (error.status == 404) {
      errorMessage = `Not found`;
    }
    if(error.status == 500) {
      errorMessage = `Internal server error`;
    }
    return throwError(errorMessage);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`).pipe(
      catchError(this.handleError)
    );
  }

  getHero(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/heroes/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  addHero(hero: HeroModel): Observable<Hero> {
    return this.http.post<HeroModel>(`${this.apiUrl}/heroes`, hero, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  editHero(hero: Hero): Observable<Hero> {
    return this.http.put<HeroModel>(`${this.apiUrl}/heroes/${hero.id}`, hero, {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteHero(heroId: any): any {
    return this.http.delete<HeroModel>(`${this.apiUrl}/heroes/${heroId}`, {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }
}
