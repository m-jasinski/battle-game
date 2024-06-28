import {
  SelectTypeBattleComponent,
  GameType,
} from './select-type-battle.component';
import { StoreService } from '../../store/store.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

describe('SelectTypeBattleComponent', () => {
  let component: SelectTypeBattleComponent;
  let fixture: ComponentFixture<SelectTypeBattleComponent>;
  let storeService = {
    updateGameType: jest.fn(),
    getGameType: jest.fn(),
  } as unknown as StoreService;
  // let storeService: StoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectTypeBattleComponent,
        BrowserAnimationsModule,
        MatSelectModule,
        FormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SelectTypeBattleComponent);
    component = fixture.componentInstance;
    storeService = TestBed.inject(StoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update game type with persons', () => {
    const newType: GameType = 'people';
    const spy = jest.spyOn(storeService, 'updateGameType');
    component.updateGameType(newType);
    expect(spy).toHaveBeenCalledWith(newType);
  });

  it('should update game type with starships', () => {
    const newType: GameType = 'starships';
    const spy = jest.spyOn(storeService, 'updateGameType');
    component.updateGameType(newType);
    expect(spy).toHaveBeenCalledWith(newType);
  });

  it('should update game type 3 times', () => {
    let newType: GameType = 'starships';
    const spy = jest.spyOn(storeService, 'updateGameType');
    component.updateGameType(newType);
    newType = 'people';
    component.updateGameType(newType);
    newType = 'starships';
    component.updateGameType(newType);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should define gameTypes and selectedValue', () => {
    expect(component.gameTypes).toBeDefined();
    expect(component.selectedValue).toBeDefined();
  });
});
