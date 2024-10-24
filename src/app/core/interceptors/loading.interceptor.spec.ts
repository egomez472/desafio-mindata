import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';
import { HttpClient, withInterceptors } from '@angular/common/http';

describe('LoadingInterceptor', () => {
  let loadingService: LoadingService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoadingService,
        withInterceptors([loadingInterceptor])
      ]
    });

    loadingService = TestBed.inject(LoadingService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should show loader on request and hide on response', () => {
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');

    httpClient.get('/test-url').subscribe();

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).not.toHaveBeenCalled();

    httpTestingController.expectOne('/test-url').flush({});

    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should finalize the request and call hide()', () => {
    spyOn(loadingService, 'hide');

    const request = httpClient.get('/test-url');

    request.subscribe();

    httpTestingController.expectOne('/test-url').flush({});

    expect(loadingService.hide).toHaveBeenCalled();
  });
});
