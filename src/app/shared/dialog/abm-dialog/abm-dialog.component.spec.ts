import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbmDialogComponent } from './abm-dialog.component';

describe('AbmDialogComponent', () => {
  let component: AbmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AbmDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, AbmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AbmDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AbmDialogComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
