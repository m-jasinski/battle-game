import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { mockPersonData, mockStarshipData } from '../../data/mocks';

describe('CardComponent for Starships', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('type', 'starships');
    fixture.componentRef.setInput('data', mockStarshipData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data as Starship', () => {
    expect(component.getDataAsStarship()).toEqual(mockStarshipData);
  });

  it('should get data as Person', () => {
    fixture.componentRef.setInput('type', 'people');
    fixture.componentRef.setInput('data', mockPersonData);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.getDataAsPerson()).toBe(mockPersonData);
  });
});
