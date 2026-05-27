import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    service.setToken('abc.def.ghi');
    expect(service.getToken()).toBe('abc.def.ghi');
  });

  it('should clear token', () => {
    service.setToken('abc.def.ghi');
    service.clearToken();
    expect(service.getToken()).toBeNull();
  });

  it('isAuthenticated returns true when token is set', () => {
    service.setToken('abc.def.ghi');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated returns false when no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });
});
