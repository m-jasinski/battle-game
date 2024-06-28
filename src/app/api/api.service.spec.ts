import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService, ResponseData, Person, Starship } from './api.service';
import { TimeoutError } from 'rxjs';
import { mockPersonData, mockStarshipData } from '../data/mocks';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRandomPerson', () => {
    it('should return a random person on successful request', (done) => {
      const mockPerson: ResponseData<Person> = {
        result: {
          properties: {
            ...mockPersonData,
          },
        },
      };

      service.getRandomPerson().subscribe((person) => {
        expect(person).toEqual(mockPerson);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/people/')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPerson);
    });

    it('should retry on 404 error', (done) => {
      service.getRandomPerson().subscribe({
        next: () => done(),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      // Simulate 3 404 errors
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne((request) =>
          request.url.startsWith('https://www.swapi.tech/api/people/')
        );
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      }

      // The 4th request should also fail
      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/people/')
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should throw an error on non-404 error', (done) => {
      service.getRandomPerson().subscribe({
        next: () => done.fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/people/')
      );
      req.flush('Error 500', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRandomStarship', () => {
    it('should return a random starship on successful request', (done) => {
      const mockStarship: ResponseData<Starship> = {
        result: {
          properties: {
            ...mockStarshipData,
          },
        },
      };

      service.getRandomStarship().subscribe((starship) => {
        expect(starship).toEqual(mockStarship);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/starships/')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStarship);
    });

    it('should retry on 404 error', (done) => {
      service.getRandomStarship().subscribe({
        next: () => done(),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      // Simulate 3 404 errors
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne((request) =>
          request.url.startsWith('https://www.swapi.tech/api/starships/')
        );
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      }

      // The 4th request should also fail
      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/starships/')
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should throw an error on non-404 error', (done) => {
      service.getRandomStarship().subscribe({
        next: () => done.fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne((request) =>
        request.url.startsWith('https://www.swapi.tech/api/starships/')
      );
      req.flush('Error 500', { status: 500, statusText: 'Server Error' });
    });
  });
});
