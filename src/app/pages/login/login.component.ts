import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  token: string | null = null;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.token = null;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.loading = true;
    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (jwt) => {
          this.loading = false;
          this.token = jwt;
          this.authService.setToken(jwt);
          this.router.navigate(['/students']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = err.status === 401
            ? 'Identifiants invalides.'
            : (err.error?.message || err.message || 'Erreur serveur, veuillez réessayer.');
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = null;
    this.token = null;
    this.loginForm.reset();
  }
}
