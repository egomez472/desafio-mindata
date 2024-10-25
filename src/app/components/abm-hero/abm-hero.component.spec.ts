import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ABMHeroComponent } from './abm-hero.component';
import { HeroesService } from '../../core/services/heroes.service';
import { LoadingService } from '../../core/services/loading.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of, Subject, throwError } from 'rxjs';
import { AbmDialogComponent } from '../../shared/dialog/abm-dialog/abm-dialog.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, By } from '@angular/platform-browser';

describe('ABMHeroComponent', () => {
  let component: ABMHeroComponent;
  let fixture: ComponentFixture<ABMHeroComponent>;
  let heroesServiceMock: jasmine.SpyObj<HeroesService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let routerMock: jasmine.SpyObj<Router>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    heroesServiceMock = jasmine.createSpyObj('HeroesService', ['getHero', 'addHero', 'editHero', 'uploadHeroImage', 'deleteHero']);
    loadingServiceMock = jasmine.createSpyObj('LoadingService', ['isLoading']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ABMHeroComponent, MatDialogModule, BrowserModule],
      providers: [
        { provide: HeroesService, useValue: heroesServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj({
            open: jasmine.createSpyObj({
                afterClosed: of(true)
            })
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ABMHeroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    component.initForm();
    expect(component.form).toBeDefined();
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('alias')).toBeTruthy();
    expect(component.form.get('powers')).toBeTruthy();
    expect(component.form.get('team')).toBeTruthy();
    expect(component.form.get('img')).toBeTruthy();
  });

  it('should load hero data when edit input is provided', fakeAsync(() => {
    const mockHero = { id: '1', name: 'Superman', alias: 'Clark Kent', powers: ['Flying'], team: 'Justice League', img: 'image-url' };
    component.edit = '1';
    heroesServiceMock.getHero.and.returnValue(of(mockHero));

    component.ngOnInit();
    tick();

    expect(heroesServiceMock.getHero).toHaveBeenCalledWith('1');
    expect(component.title).toBe('Edit hero');
    expect(component.nameControl?.value).toBe('Superman');
    expect(component.aliasControl?.value).toBe('Clark Kent');
  }));

  it('should navigate to heroes on hero not found', () => {
    component.edit = '1';
    heroesServiceMock.getHero.and.returnValue(throwError({ status: 404 }));

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['heroes']);
  });

  it('should add a hero when form is valid', async () => {
    component.initForm();
    component.form.patchValue({
      name: 'Batman',
      alias: 'Bruce Wayne',
      powers: ['Stealth'],
      team: 'Justice League',
      img: 'image-url'
    });

    heroesServiceMock.addHero.and.returnValue(of({ id: '2', name: 'Batman', alias: 'Bruce Wayne', powers: ['Stealth'], team: 'Justice League', img: 'image-url' }));

    await component.onSubmit(component.form);

    expect(heroesServiceMock.addHero).toHaveBeenCalledWith(jasmine.any(Object));
    expect(routerMock.navigate).toHaveBeenCalledWith(['heroes']);
  });

  it('should edit a hero when form is valid', async () => {
    component.edit = '1';
    component.initForm();
    component.form.patchValue({
      id: '1',
      name: 'Batman',
      alias: 'Bruce Wayne',
      powers: ['Stealth'],
      team: 'Justice League',
      img: 'image-url'
    });

    heroesServiceMock.editHero.and.returnValue(of({ id: '1', name: 'Batman', alias: 'Bruce Wayne', powers: ['Stealth'], team: 'Justice League', img: 'image-url' }));

    await component.onSubmit(component.form);

    expect(heroesServiceMock.editHero).toHaveBeenCalledWith(component.form.value);
    expect(routerMock.navigate).toHaveBeenCalledWith(['heroes']);
  });

  xit('should open dialog and delete hero', fakeAsync(() => {

    const mockHero = { id: '1', name: 'Batman', alias: 'Bruce Wayne', powers: ['Stealth'], team: 'Justice League', img: 'image-url' };
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    component.deleteHero(mockHero);

    dialogMock.open.and.returnValue(mockDialogRef);

    mockDialogRef.afterClosed.and.returnValue(of(true))

    heroesServiceMock.deleteHero.and.returnValue(of(mockHero));

    expect(dialogMock.open).toHaveBeenCalled();
    expect(heroesServiceMock.deleteHero).toHaveBeenCalledWith('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['heroes']);
  }));

  it('should upload an image and set it to heroImage', () => {
    const event = {
      target: {
        files: [new Blob(['image data'], { type: 'image/png' })]
      }
    };

    component.uploadImage(event);

    expect(component.heroImage[0]).toBeDefined();
  });
});