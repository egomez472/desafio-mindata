import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoading to true when show() is called', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();
  });

  it('should return true when show() is called', () => {
    const result = service.show();
    expect(result).toBeTrue();
  });

  it('should set isLoading to false when hide() is called', () => {
    service.hide();
    expect(service.isLoading()).toBeFalse();
  });

  it('should return false when hide() is called', () => {
    const result = service.hide();
    expect(result).toBeFalse();
  });
});
