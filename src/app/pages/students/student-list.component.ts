import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { AuthService } from '../../core/service/auth.service';
import { Student } from '../../core/models/Student';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  students: Student[] = [];
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;
    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = err.error?.message || err.message || 'Erreur serveur.';
        }
      });
  }

  onDelete(id: number | undefined): void {
    if (!id || !confirm('Supprimer cet étudiant ?')) {
      return;
    }
    this.studentService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || err.message || 'Erreur lors de la suppression.';
        }
      });
  }

  onLogout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
