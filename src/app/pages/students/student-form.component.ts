import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form: FormGroup = new FormGroup({});
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  editingId: number | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      email: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingId = Number(idParam);
      this.loading = true;
      this.studentService.getById(this.editingId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (s) => {
            this.form.patchValue(s);
            this.loading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.loading = false;
            this.errorMessage = err.status === 404
              ? 'Étudiant introuvable.'
              : (err.error?.message || err.message || 'Erreur serveur.');
          }
        });
    }
  }

  get controls() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    if (this.form.invalid) {
      return;
    }

    const student: Student = this.form.value;
    this.loading = true;

    const request$ = this.editingId
      ? this.studentService.update(this.editingId, student)
      : this.studentService.create(student);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/students']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = err.error?.message || err.message || 'Erreur serveur.';
        }
      });
  }
}
