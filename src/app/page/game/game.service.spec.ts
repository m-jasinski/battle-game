import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { ApiService } from '../../api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { GameResult } from '../../store/store.service';

describe('GameService', () => {
  let service: GameService;
  let apiServiceMock: jest.Mocked<ApiService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    apiServiceMock = {
      getRandomPerson: jest.fn(),
      getRandomStarship: jest.fn(),
    } as any;

    snackBarMock = {
      open: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openSuccessSnackBar', () => {
    it('should open snackbar with "DRAW" message', () => {
      service.openSuccessSnackBar(GameResult.DRAW);
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'DRAW',
        'CLOSE',
        expect.any(Object)
      );
    });

    it('should open snackbar with "PLAYER 1 WON" message', () => {
      service.openSuccessSnackBar(GameResult.PLAYER1);
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'PLAYER 1 WON',
        'CLOSE',
        expect.any(Object)
      );
    });

    it('should open snackbar with "PLAYER 2 WON" message', () => {
      service.openSuccessSnackBar(GameResult.PLAYER2);
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'PLAYER 2 WON',
        'CLOSE',
        expect.any(Object)
      );
    });
  });

  describe('openErrorSnackBar', () => {
    it('should open snackbar with error message', () => {
      service.openErrorSnackBar();
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'ERROR getting data. Try again in a moment',
        'CLOSE',
        expect.any(Object)
      );
    });
  });

  describe('getValueAsNumber', () => {
    it('should return number for numeric string', () => {
      expect(service.getValueAsNumber('123')).toBe(123);
    });

    it('should return 0 for "unknown"', () => {
      expect(service.getValueAsNumber('unknown')).toBe(0);
    });

    it('should handle comma-separated numbers', () => {
      expect(service.getValueAsNumber('1,234')).toBe(1234);
    });

    it('should handle range and return the higher number', () => {
      expect(service.getValueAsNumber('100-200')).toBe(200);
    });

    it('should return 0 for invalid input', () => {
      expect(service.getValueAsNumber('invalid')).toBe(0);
    });
  });

  describe('submitResult', () => {
    it('should return PLAYER1 when player1 wins', () => {
      expect(service.submitResult('100', '50')).toBe(GameResult.PLAYER1);
    });

    it('should return PLAYER2 when player2 wins', () => {
      expect(service.submitResult('50', '100')).toBe(GameResult.PLAYER2);
    });

    it('should return DRAW when values are equal', () => {
      expect(service.submitResult('100', '100')).toBe(GameResult.DRAW);
    });
  });

  describe('getPersons', () => {
    it('should call getRandomPerson twice', (done) => {
      apiServiceMock.getRandomPerson.mockReturnValue(of({} as any));

      service.getPersons().subscribe(() => {
        expect(apiServiceMock.getRandomPerson).toHaveBeenCalledTimes(2);
        done();
      });
    });
  });

  describe('getStarships', () => {
    it('should call getRandomStarship twice', (done) => {
      apiServiceMock.getRandomStarship.mockReturnValue(of({} as any));

      service.getStarships().subscribe(() => {
        expect(apiServiceMock.getRandomStarship).toHaveBeenCalledTimes(2);
        done();
      });
    });
  });
});
