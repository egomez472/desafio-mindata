import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

interface Hero {
  id: string,
  name: string,
  alias: string,
  powers: string[],
  team: string,
  img: string
}

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    initializeApp(environment.firebaseConfig);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifico que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test para getHeroes
  it('should retrieve all heroes (GET)', () => {
    const mockHeroes: Hero[] = [
      { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' }
    ];

    service.getHeroes().subscribe((heroes : any) => {
      expect(heroes.length).toBe(1);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should handle error while fetching heroes', () => {

    service.getHeroes().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: string) => {
        console.error('Error caught in test:', error);

        expect(error).toBe('Código de error: 500 Mensaje: Http failure response for http://localhost:3000/heroes: 500 Internal Server Error');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes`);
    req.flush('Something went wrong', { status: 500, statusText: 'Internal Server Error' });
  });

  // Test para getHero
  it('should retrieve a hero by id (GET)', () => {
    const mockHero: Hero = { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' };

    service.getHero('1').subscribe((hero : any) => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
  });

  it('should handle error while fetching a hero by id', () => {
    service.getHero('1').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/heroes/1`);
    req.flush('Hero not found', { status: 404, statusText: 'Not Found' });
  });

  // Test para addHero
  it('should add a new hero (POST)', () => {
    const newHero: Hero = { id: '2', name: 'Tony Stark', alias: 'Iron Man', powers: ['Tech genius'], team: 'Avengers', img: '' };

    service.addHero(newHero).subscribe((hero : any) => {
      expect(hero).toEqual(newHero);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes`);
    expect(req.request.method).toBe('POST');
    req.flush(newHero);
  });

  // Test para editHero
  it('should update a hero (PUT)', () => {
    const updatedHero = { id: 1,name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' };

    service.editHero(updatedHero).subscribe((hero) => {
      expect(hero).toEqual(updatedHero);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedHero);
  });

  // Test para deleteHero
  it('should delete a hero (DELETE)', () => {
    const heroId = '1';

    service.deleteHero(heroId).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
