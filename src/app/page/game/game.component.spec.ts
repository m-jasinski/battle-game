import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameResult, StoreService } from '../../store/store.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameService } from './game.service';
import { of, throwError } from 'rxjs';
import {
  mockResponsePersonPlayer1,
  mockResponsePersonPlayer2,
  mockResponseStarshipPlayer1,
  mockResponseStarshipPlayer2,
} from '../../data/mocks';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let storeServiceMock: jest.Mocked<StoreService>;
  let gameServiceMock: jest.Mocked<GameService>;
  let changeDetectorRefMock: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    storeServiceMock = {
      getGameType: jest.fn(),
      getPlayer1Score: jest.fn(),
      getPlayer2Score: jest.fn(),
      resetPlayersStats: jest.fn(),
      addPoint: jest.fn(),
    } as any;

    gameServiceMock = {
      getPersons: jest.fn().mockReturnValue(of(mockResponsePersonPlayer1)),
      getStarships: jest.fn().mockReturnValue(of(mockResponseStarshipPlayer1)),
      submitResult: jest.fn(),
      openSuccessSnackBar: jest.fn(),
      openErrorSnackBar: jest.fn(),
    } as any;

    changeDetectorRefMock = {
      detectChanges: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [GameComponent, NoopAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: StoreService, useValue: storeServiceMock },
        { provide: GameService, useValue: gameServiceMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch persons data when game type is people', () => {
    storeServiceMock.getGameType.mockReturnValue('people');
    gameServiceMock.getPersons.mockReturnValue(
      of([mockResponsePersonPlayer1, mockResponsePersonPlayer2])
    );

    fixture.detectChanges();

    expect(gameServiceMock.getPersons).toHaveBeenCalled();
    expect(gameServiceMock.getStarships).not.toHaveBeenCalled();
  });

  it('should fetch starships data when game type is starships', () => {
    storeServiceMock.getGameType.mockReturnValue('starships');
    gameServiceMock.getStarships.mockReturnValue(
      of([mockResponseStarshipPlayer1, mockResponseStarshipPlayer2])
    );

    fixture.detectChanges();

    expect(gameServiceMock.getStarships).toHaveBeenCalled();
    expect(gameServiceMock.getPersons).not.toHaveBeenCalled();
  });

  it('should handle error when fetching data', () => {
    storeServiceMock.getGameType.mockReturnValue('people');
    gameServiceMock.getPersons.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalsy();
    expect(component.isError).toBeTruthy();
    expect(gameServiceMock.openErrorSnackBar).toHaveBeenCalled();
  });

  it('should clear score', () => {
    component.clearScore();
    expect(storeServiceMock.resetPlayersStats).toHaveBeenCalled();
  });

  it('should fetch new data', () => {
    component.gameType = 'people';
    gameServiceMock.getPersons.mockReturnValue(
      of([mockResponsePersonPlayer1, mockResponsePersonPlayer2])
    );

    component.fetchData();
    expect(gameServiceMock.getPersons).toHaveBeenCalled();
  });

  it('should set fetched data for people and player 1 wins', () => {
    const mockData = [
      {
        ...mockResponsePersonPlayer1,
        result: { properties: { mass: '80' } },
      },
      {
        ...mockResponsePersonPlayer2,
        result: { properties: { mass: '75' } },
      },
    ];
    gameServiceMock.submitResult.mockReturnValue(GameResult.PLAYER1);

    component['_setFetchedData']('people', mockData as any);

    expect(component.player1Data).toEqual({ mass: '80' });
    expect(component.player2Data).toEqual({ mass: '75' });
    expect(gameServiceMock.submitResult).toHaveBeenCalledWith('80', '75');
    expect(storeServiceMock.addPoint).toHaveBeenCalledWith(GameResult.PLAYER1);
  });

  it('should set fetched data for people, get draw', () => {
    const mockData = [
      {
        ...mockResponsePersonPlayer1,
        result: { properties: { mass: '80' } },
      },
      {
        ...mockResponsePersonPlayer2,
        result: { properties: { mass: '80' } },
      },
    ];
    gameServiceMock.submitResult.mockReturnValue(GameResult.DRAW);

    component['_setFetchedData']('people', mockData as any);

    expect(component.player1Data).toEqual({ mass: '80' });
    expect(component.player2Data).toEqual({ mass: '80' });
    expect(gameServiceMock.submitResult).toHaveBeenCalledWith('80', '80');
    expect(storeServiceMock.addPoint).toHaveBeenCalledWith(GameResult.DRAW);
  });

  it('should set fetched data for starships and player 2 wins', () => {
    const mockData = [
      {
        ...mockResponseStarshipPlayer1,
        result: { properties: { crew: '10' } },
      },
      {
        ...mockResponseStarshipPlayer2,
        result: { properties: { crew: '20' } },
      },
    ];
    gameServiceMock.submitResult.mockReturnValue(GameResult.PLAYER2);

    component['_setFetchedData']('starships', mockData as any);

    expect(component.player1Data).toEqual({ crew: '10' });
    expect(component.player2Data).toEqual({ crew: '20' });
    expect(gameServiceMock.submitResult).toHaveBeenCalledWith('10', '20');
    expect(storeServiceMock.addPoint).toHaveBeenCalledWith(GameResult.PLAYER2);
  });
});
