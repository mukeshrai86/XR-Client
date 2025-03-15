import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSummaryComponent } from './contact-summary.component';

describe('ContactSummaryComponent', () => {
  let component: ContactSummaryComponent;
  let fixture: ComponentFixture<ContactSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
