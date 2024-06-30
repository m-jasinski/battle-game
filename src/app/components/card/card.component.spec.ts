import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { mockPersonData } from '../../data/mocks';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('type', 'starships');
    fixture.componentRef.setInput('player', 'Player 1');
    fixture.componentRef.setInput('playerData', mockPersonData);
    fixture.componentRef.setInput('playerScore', 0);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('shouldAnimate', false);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
