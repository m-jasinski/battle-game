import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { StoreService } from '../../store/store.service';
import { ApiService } from '../../api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let storeServiceMock: jest.Mocked<StoreService>;
  let apiServiceMock: jest.Mocked<ApiService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    storeServiceMock = {
      getGameType: jest.fn(),
      getPlayer1Score: jest.fn(),
      getPlayer2Score: jest.fn(),
      resetPleyrsStats: jest.fn(),
      addPoint: jest.fn(),
    } as any;

    apiServiceMock = {
      getRandomPerson: jest.fn(),
      getRandomStarship: jest.fn(),
    } as any;

    snackBarMock = {
      open: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        GameComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: StoreService, useValue: storeServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should set game type and fetch data on initialization', () => {
      storeServiceMock.getGameType.mockReturnValue('people');
      const getPersonsSpy = jest.spyOn(component as any, '_getPersons');

      fixture.detectChanges();

      expect(component.gameType).toBe('people');
      expect(getPersonsSpy).toHaveBeenCalled();
    });

    it('should set player scores on initialization', () => {
      storeServiceMock.getPlayer1Score.mockReturnValue(5);
      storeServiceMock.getPlayer2Score.mockReturnValue(3);

      fixture.detectChanges();

      expect(component.player1Score).toBe(5);
      expect(component.player2Score).toBe(3);
    });
  });

  describe('fetchData', () => {
    it('should call _getPersons when game type is people', () => {
      component.gameType = 'people';
      const getPersonsSpy = jest.spyOn(component as any, '_getPersons');

      component.fetchData();

      expect(getPersonsSpy).toHaveBeenCalled();
    });

    it('should call _getStarships when game type is starships', () => {
      component.gameType = 'starships';
      const getStarshipsSpy = jest.spyOn(component as any, '_getStarships');

      component.fetchData();

      expect(getStarshipsSpy).toHaveBeenCalled();
    });
  });

  describe('clearScore', () => {
    it('should call resetPleyrsStats on StoreService', () => {
      component.clearScore();
      expect(storeServiceMock.resetPleyrsStats).toHaveBeenCalled();
    });
  });
});
