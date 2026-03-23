import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilosofyComponent } from './filosofy.component';

describe('FilosofyComponent', () => {
  let component: FilosofyComponent;
  let fixture: ComponentFixture<FilosofyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilosofyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilosofyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
