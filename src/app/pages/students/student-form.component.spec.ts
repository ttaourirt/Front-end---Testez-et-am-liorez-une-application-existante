import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { StudentFormComponent } from './student-form.component';

function setupTestBed(idParam: string | null) {
  return TestBed.configureTestingModule({
    imports: [StudentFormComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => idParam } } }
      }
    ]
  }).compileComponents();
}

describe('StudentFormComponent (create mode)', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await setupTestBed(null);
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.editingId).toBeNull();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
    httpMock.expectNone('/api/students');
  });

  it('should POST and navigate on valid submit', () => {
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    component.form.patchValue({ firstName: 'A', lastName: 'B' });

    component.onSubmit();

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, firstName: 'A', lastName: 'B' });

    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});

describe('StudentFormComponent (edit mode)', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await setupTestBed('3');
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should load student on init', () => {
    const req = httpMock.expectOne('/api/students/3');
    req.flush({ id: 3, firstName: 'A', lastName: 'B', email: 'a@a.fr' });

    expect(component.editingId).toBe(3);
    expect(component.form.value.firstName).toBe('A');
  });

  it('should PUT and navigate on valid submit', () => {
    httpMock.expectOne('/api/students/3').flush({
      id: 3, firstName: 'A', lastName: 'B'
    });

    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    component.form.patchValue({ firstName: 'Aline' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/students/3');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 3, firstName: 'Aline', lastName: 'B' });

    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
