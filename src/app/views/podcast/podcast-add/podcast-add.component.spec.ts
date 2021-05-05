import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastAddComponent } from './podcast-add.component';

describe('PodcastAddComponent', () => {
  let component: PodcastAddComponent;
  let fixture: ComponentFixture<PodcastAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcastAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
