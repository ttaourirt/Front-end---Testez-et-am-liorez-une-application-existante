import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentService } from './student.service';
import { Student } from '../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET /api/students', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Alice', lastName: 'Martin' }
    ];

    service.getAll().subscribe(result => expect(result).toEqual(mockStudents));

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('getById should GET /api/students/:id', () => {
    const mock: Student = { id: 5, firstName: 'Bob', lastName: 'Durand' };

    service.getById(5).subscribe(result => expect(result).toEqual(mock));

    const req = httpMock.expectOne('/api/students/5');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create should POST /api/students', () => {
    const body: Student = { firstName: 'Carol', lastName: 'Petit' };

    service.create(body).subscribe();

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ ...body, id: 9 });
  });

  it('update should PUT /api/students/:id', () => {
    const body: Student = { firstName: 'Dave', lastName: 'Lopez' };

    service.update(3, body).subscribe();

    const req = httpMock.expectOne('/api/students/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({ ...body, id: 3 });
  });

  it('delete should DELETE /api/students/:id', () => {
    service.delete(7).subscribe();

    const req = httpMock.expectOne('/api/students/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
