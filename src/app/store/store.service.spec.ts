import { TestBed } from '@angular/core/testing';
import { StoreService } from './store.service';
import { GameType } from '../components/select-type-battle/select-type-battle.component';

describe('StoreService', () => {
  let storeService: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storeService = TestBed.inject(StoreService);
  });

  it('should be created', () => {
    expect(storeService).toBeTruthy();
  });

  it('should update the game type', () => {
    let newType: GameType = 'people';
    storeService.updateGameType(newType);
    expect(storeService.getGameType()).toBe(newType);

    newType = 'starships';
    storeService.updateGameType(newType);
    expect(storeService.getGameType()).toBe(newType);
  });

  it('should update the player 1 score', () => {
    storeService.addPoint(1);
    expect(storeService.getPlayer1Score()).toBe(1);
  });

  it('should update the player 2 score', () => {
    storeService.addPoint(2);
    expect(storeService.getPlayer2Score()).toBe(1);
  });

  it("should reset the players' scores", () => {
    storeService.addPoint(1);
    storeService.addPoint(2);
    storeService.resetPleyrsStats();
    expect(storeService.getPlayer1Score()).toBe(0);
    expect(storeService.getPlayer2Score()).toBe(0);
  });
});
