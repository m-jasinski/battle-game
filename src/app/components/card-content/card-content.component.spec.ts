import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardContentComponent } from './card-content.component';
import { mockPersonData, mockStarshipData } from '../../data/mocks';

describe('CardContentComponent for Starships', () => {
  let component: CardContentComponent;
  let fixture: ComponentFixture<CardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardContentComponent);
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
