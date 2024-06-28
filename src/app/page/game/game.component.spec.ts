import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { StoreService } from '../../store/store.service';
import { ApiService } from '../../api/api.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { getPersonInitialData } from '../../data/person-data';
import { getStarshipInitialData } from '../../data/starship-data.';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let storeServiceMock: jest.Mocked<StoreService>;
  let apiServiceMock: jest.Mocked<ApiService>;
  let changeDetectorRefMock: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    storeServiceMock = {
      getGameType: jest.fn(),
      getPlayer1Score: jest.fn(),
      getPlayer2Score: jest.fn(),
      resetPlayersStats: jest.fn(),
      addPoint: jest.fn(),
    } as any;

    apiServiceMock = {
      getRandomPerson: jest.fn(),
      getRandomStarship: jest.fn(),
    } as any;

    changeDetectorRefMock = {
      detectChanges: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        GameComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: StoreService, useValue: storeServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch persons on initialization when gameType is people', () => {
    jest.spyOn(storeServiceMock, 'getGameType').mockReturnValue('people');
    const getPersonsSpy = jest.spyOn(component as any, '_getPersons');

    fixture.detectChanges();

    expect(getPersonsSpy).toHaveBeenCalled();
  });

  it('should fetch starships on initialization when gameType is starships', () => {
    jest.spyOn(storeServiceMock, 'getGameType').mockReturnValue('starships');
    const getStarshipsSpy = jest.spyOn(component as any, '_getStarships');

    fixture.detectChanges();

    expect(getStarshipsSpy).toHaveBeenCalled();
  });

  it('should update player scores on initialization', () => {
    jest.spyOn(storeServiceMock, 'getPlayer1Score').mockReturnValue(0);
    jest.spyOn(storeServiceMock, 'getPlayer2Score').mockReturnValue(0);

    fixture.detectChanges();

    expect(component.player1Score).toBe(0);
    expect(component.player2Score).toBe(0);
  });

  it('should call _getPersons when fetchData is called with gameType people', () => {
    component.gameType = 'people';
    const getPersonsSpy = jest.spyOn(component as any, '_getPersons');

    component.fetchData();

    expect(getPersonsSpy).toHaveBeenCalled();
  });

  it('should call _getStarships when fetchData is called with gameType starships', () => {
    component.gameType = 'starships';
    const getStarshipsSpy = jest.spyOn(component as any, '_getStarships');

    component.fetchData();

    expect(getStarshipsSpy).toHaveBeenCalled();
  });

  it('should call resetPlayersStats when clearScore is called', () => {
    component.clearScore();
    expect(storeServiceMock.resetPlayersStats).toHaveBeenCalled();
  });

  it('should correctly parse numeric values', () => {
    expect((component as any)._getValue('100')).toBe(100);
    expect((component as any)._getValue('unknown')).toBe(0);
    expect((component as any)._getValue('1,000')).toBe(1000);
    expect((component as any)._getValue('100-200')).toBe(200);
    expect((component as any)._getValue('invalid')).toBe(0);
  });

  it('should submit result correctly when player 1 wins', async () => {
    const openSnackBarSpy = jest.spyOn(component as any, '_openSnackBar');
    await (component as any)._submitResult('100', '50');

    expect(component.whichPlayerWon).toBe(1);
    expect(storeServiceMock.addPoint).toHaveBeenCalledWith(1);
    expect(openSnackBarSpy).toHaveBeenCalledWith('PLAYER 1 WON');
  });

  it('should submit result correctly when player 2 wins', async () => {
    const openSnackBarSpy = jest.spyOn(component as any, '_openSnackBar');
    await (component as any)._submitResult('50', '100');

    expect(component.whichPlayerWon).toBe(2);
    expect(storeServiceMock.addPoint).toHaveBeenCalledWith(2);
    expect(openSnackBarSpy).toHaveBeenCalledWith('PLAYER 2 WON');
  });

  it('should submit result correctly on draw', async () => {
    const openSnackBarSpy = jest.spyOn(component as any, '_openSnackBar');
    await (component as any)._submitResult('100', '100');

    expect(openSnackBarSpy).toHaveBeenCalledWith('DRAW');
  });

  it('should return correct initial value for people', () => {
    expect((component as any)._initialValue('people')).toEqual(
      getPersonInitialData()
    );
  });

  it('should return correct initial value for starships', () => {
    expect((component as any)._initialValue('starships')).toEqual(
      getStarshipInitialData()
    );
  });
});
