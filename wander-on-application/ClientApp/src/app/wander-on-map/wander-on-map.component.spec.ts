import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WanderOnMapComponent } from './wander-on-map.component';

describe('WanderOnMapComponent', () => {
  let component: WanderOnMapComponent;
  let fixture: ComponentFixture<WanderOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WanderOnMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WanderOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
