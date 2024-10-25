import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL on link click', () => {
    const url = 'https://www.linkedin.com/in/ericgomez29/';
    spyOn(window, 'open'); // Espiar la función window.open
    component.navigate(url);
    expect(window.open).toHaveBeenCalledWith(url, '_blank');
  });
});
