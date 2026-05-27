import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/students').flush([]);
    expect(component).toBeTruthy();
  });

  it('should load and display students', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/students');
    req.flush([
      { id: 1, firstName: 'Alice', lastName: 'Martin' },
      { id: 2, firstName: 'Bob', lastName: 'Durand' }
    ]);
    expect(component.students.length).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('should set errorMessage on HTTP error', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/students').flush(
      { message: 'fail' },
      { status: 500, statusText: 'Server Error' }
    );
    expect(component.errorMessage).toBeTruthy();
    expect(component.loading).toBe(false);
  });

  it('should not call delete when user cancels', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/students').flush([]);

    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.onDelete(1);
    httpMock.expectNone('/api/students/1');
  });

  it('should call delete and reload on confirmation', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/students').flush([
      { id: 1, firstName: 'A', lastName: 'B' }
    ]);

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(1);

    const deleteReq = httpMock.expectOne('/api/students/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    httpMock.expectOne('/api/students').flush([]);
    expect(component.students.length).toBe(0);
  });
});
