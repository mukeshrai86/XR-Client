import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLogComponent } from './job-log.component';

describe('JobLogComponent', () => {
  let component: JobLogComponent;
  let fixture: ComponentFixture<JobLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
