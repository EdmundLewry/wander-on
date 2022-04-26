import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WanderOnSceneComponent } from './wander-on-scene.component';

describe('WanderOnSceneComponent', () => {
  let component: WanderOnSceneComponent;
  let fixture: ComponentFixture<WanderOnSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WanderOnSceneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WanderOnSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
