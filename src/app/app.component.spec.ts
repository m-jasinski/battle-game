// import { TestBed } from '@angular/core/testing';
// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AppComponent],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StoreService } from './store/store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectTypeBattleComponent } from './components/select-type-battle/select-type-battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let storeServiceMock: jest.Mocked<StoreService>;

  beforeEach(async () => {
    storeServiceMock = {
      getGameType: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        AppComponent,
        SelectTypeBattleComponent,
      ],
      providers: [{ provide: StoreService, useValue: storeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.gameType).toBe('starships');
    expect(component.classLogo).toBe('bg-ship');
  });

  it('should update gameType and classLogo when StoreService.getGameType changes to "people"', () => {
    storeServiceMock.getGameType.mockReturnValue('people');

    fixture.detectChanges();

    expect(component.gameType).toBe('people');
    expect(component.classLogo).toBe('bg-vader');
  });

  it('should update gameType and classLogo when StoreService.getGameType changes to "starships"', () => {
    storeServiceMock.getGameType.mockReturnValue('starships');

    fixture.detectChanges();

    expect(component.gameType).toBe('starships');
    expect(component.classLogo).toBe('bg-ship');
  });

  it('should call StoreService.getGameType in the effect', () => {
    fixture.detectChanges();
    expect(storeServiceMock.getGameType).toHaveBeenCalled();
  });
});
