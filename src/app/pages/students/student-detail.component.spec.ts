import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { StudentDetailComponent } from './student-detail.component';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '7' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should load student by id', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/students/7');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7, firstName: 'Carol', lastName: 'Petit' });

    expect(component.student?.firstName).toBe('Carol');
    expect(component.loading).toBe(false);
  });

  it('shows "introuvable" message on 404', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/students/7').flush(
      {},
      { status: 404, statusText: 'Not Found' }
    );
    expect(component.errorMessage).toContain('introuvable');
  });
});
