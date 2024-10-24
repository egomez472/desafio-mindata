import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroCardComponent } from './hero-card.component';
import { Router } from '@angular/router';
import { Hero } from '../../../core/models/hero.model';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;
  let mockRouter: any;

  const mockHero: Hero = {
    id: '1',
    name: 'Peter Parker',
    alias: 'SPIDER-MAN',
    powers: ['Super strength','Wall-crawling','Spider-sense','Agility'],
    team: 'Avengers',
    img: 'https://firebasestorage.googleapis.com/v0/b/heroes-proyect-b95d8.appspot.com/o/hero-image_1729551130941?alt=media&token=b8f6fadc-00a6-4896-92b1-3e9acb1304e2'
  };

  beforeEach(async () => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [CommonModule, HeroCardComponent],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    component.hero = mockHero;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the hero alias, name, powers, team and image', () => {
    const aliasElement = fixture.debugElement.query(By.css('.alias')).nativeElement;
    const nameElement = fixture.debugElement.query(By.css('.name')).nativeElement;
    const powersElement = fixture.debugElement.query(By.css('.powers')).nativeElement;
    const teamElement = fixture.debugElement.query(By.css('.team')).nativeElement;
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(aliasElement.textContent).toContain(mockHero.alias);
    expect(nameElement.textContent).toContain(mockHero.name);
    expect(powersElement.textContent).toContain(mockHero.powers.join(','));
    expect(teamElement.textContent).toContain(mockHero.team);
    expect(imgElement.src).toContain(mockHero.img);
  });

  it('should navigate to edit hero page when card is clicked', () => {
    const cardElement = fixture.debugElement.query(By.css('.hero-card-container'));
    cardElement.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['abm-hero'], { queryParams: { edit: mockHero.id } });
  });
});
