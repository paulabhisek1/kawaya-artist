import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastEditComponent } from './podcast-edit.component';

describe('PodcastEditComponent', () => {
  let component: PodcastEditComponent;
  let fixture: ComponentFixture<PodcastEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcastEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
