import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
    httpMock.expectNone('/api/login');
  });

  it('should call API and store token on valid submit', () => {
    const authService = TestBed.inject(AuthService);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.loginForm.setValue({ login: 'alice', password: 'secret' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush('fake.jwt.token');

    expect(authService.getToken()).toBe('fake.jwt.token');
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should reset form', () => {
    component.loginForm.setValue({ login: 'alice', password: 'secret' });
    component.submitted = true;
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.loginForm.value.login).toBeNull();
  });
});
