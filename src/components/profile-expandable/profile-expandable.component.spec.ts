import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileExpandableComponent } from './profile-expandable.component';

describe('ProfileExpandableComponent', () => {
  let component: ProfileExpandableComponent;
  let fixture: ComponentFixture<ProfileExpandableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileExpandableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileExpandableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
