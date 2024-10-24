import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbmDialogComponent } from './abm-dialog.component';

describe('AbmDialogComponent', () => {
  let component: AbmDialogComponent;
  let fixture: ComponentFixture<AbmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AbmDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, AbmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AbmDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AbmDialogComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a span title with the correct text', () => {
    const spanElement: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(spanElement).toBeTruthy();
    expect(spanElement.textContent).toContain('¿Are you sure to delete this hero?');
  });

  it('should contain a button for confirmation with the correct text', () => {
    const confirmButton: HTMLElement = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(confirmButton).toBeTruthy();
    expect(confirmButton.textContent).toContain('Yes, delete');
  });

  it('should contain a button to close with the correct text', () => {
    const cancelButton: HTMLElement = fixture.nativeElement.querySelector('button[color="accent"]');
    expect(cancelButton).toBeTruthy();
    expect(cancelButton.textContent).toContain('No');
  });

  it('should call dialogRef.close(true) when confirm is called', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close(false) when closeDilog is called', () => {
    component.closeDilog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
