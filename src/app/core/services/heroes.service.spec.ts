import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { HeroesComponent } from '../../components/heroes/heroes.component';

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
  const mockStorage: any = {};

  beforeEach(() => {

    initializeApp(environment.firebaseConfig);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroesService,
        { provide: 'storage', useValue: mockStorage }
      ]
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

  // Test de handleError
  it('should return "Not found" for a 404 error', () => {
    service.getHeroes().subscribe({
      next: () => fail('Expected an error, no heroes'),
      error: (errorMessage: string) => {
        expect(errorMessage).toBe('Not found');
      }
    })

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(null, {status:404,statusText:'Not found'});
  });

  it('should return "Internal server error" for a 500 error', () => {
    service.getHeroes().subscribe({
      next: () => fail('Expected an error, internal server error'),
      error: (errorMessage: string) => {
        expect(errorMessage).toBe('Internal server error');
      }
    })

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(null, {status:500,statusText:'Not found'});
  });

  it('should return "Unknown error"', () => {
    service.getHeroes().subscribe({
      next: () => fail('Expected an error, unknown error'),
      error: (errorMessage: string) => {
        expect(errorMessage).toBe('Unknown error');
      }
    })

    const req = httpMock.expectOne(`${service['apiUrl']}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(null, {status:401,statusText:'Unauthorized'});
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

  //Test para getHeroByAlias
  it('should set originalHeroesList when alias is an empty string', () => {
    const originalList = [
      { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' },
      { id: '2', name: 'Brece Wayne', alias: 'Batman', powers: ['Fly'], team: 'Justice League', img: '' }
    ];

    spyOn(service, 'originalHeroesList').and.returnValue(originalList);
    spyOn(service.heroesList, 'set');

    service.getHeroesByAlias('');

    expect(service.heroesList.set).toHaveBeenCalledWith(originalList);
  });

  it('should filter heroes by alias', () => {
    const originalList = [
      { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' },
      { id: '2', name: 'Brece Wayne', alias: 'Batman', powers: ['Fly'], team: 'Justice League', img: '' },
      { id: '3', name: 'Barry Alen', alias: 'Flash', powers: ['Super speed'], team: 'Justice League', img: '' }
    ];

    spyOn(service, 'originalHeroesList').and.returnValue(originalList);
    spyOn(service.heroesList, 'set');

    service.getHeroesByAlias('man');

    expect(service.heroesList.set).toHaveBeenCalledWith([
      { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' },
      { id: '2', name: 'Brece Wayne', alias: 'Batman', powers: ['Fly'], team: 'Justice League', img: '' }
    ])
  });

  it('should be case insensitive when filtering', () => {
    const originalList = [
      { id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' },
      { id: '2', name: 'Brece Wayne', alias: 'Batman', powers: ['Fly'], team: 'Justice League', img: '' },
      { id: '3', name: 'Barry Alen', alias: 'Flash', powers: ['Super speed'], team: 'Justice League', img: '' }
    ];

    spyOn(service, 'originalHeroesList').and.returnValue(originalList);
    spyOn(service.heroesList, 'set');

    service.getHeroesByAlias('spider-man');

    expect(service.heroesList.set).toHaveBeenCalledWith([{ id: '1', name: 'Peter Parker', alias: 'Spider-Man', powers: ['Super strength'], team: 'Avengers', img: '' }])
  })

  // Test para uploadHeroImage
  it('should return an empty string if file is null', async () => {
    const result = await service.uploadHeroImage('testName', null);
    expect(result).toBe('');
  });

  it('should return download URL on success', async () => {
    const mockFile = new File([''], 'test.jpg', {type: 'image/jpeg'});
    const mockURL = "https://mock-download-url.com/test.jpg";

    spyOn(service, 'uploadBytesFn').and.returnValue(Promise.resolve(mockURL))

    const req = await service.uploadHeroImage('testName', mockFile);
    expect(req).toBe(mockURL)
  });

  it('should throw an error if upload fails', async () => {
    const mockFile = new File([''], 'test.jpg', {type: 'image/jpeg'});
    const errorMessage = 'Failed to upload';

    spyOn(service, 'uploadBytesFn').and.returnValue(Promise.reject(new Error(errorMessage)));

    try {
      await service.uploadHeroImage('testName', mockFile);
      fail('Expected error to be thrown');
    } catch (error: any) {
      expect(error.message).toBe(`Error subiendo imagen: ${errorMessage}`)
    }
  });
});
