import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../model/beneficio';

@Component({
  selector: 'app-beneficio-form',
  templateUrl: './beneficio-form.html',
  styleUrls: ['./beneficio-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class BeneficioFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly beneficioService = inject(BeneficioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  editingBeneficioId: string | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      value: [null, [Validators.required, Validators.min(0)]],
      active: [true],
      version: [null]
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.editingBeneficioId = id;

    if (id) {
      this.beneficioService.findById(+id).subscribe(beneficio => {
        this.form.patchValue(beneficio);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const beneficio: Beneficio = this.form.value;
    if (beneficio.id) {
      this.beneficioService.update(beneficio.id, beneficio).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.beneficioService.create(beneficio).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get value() {
    return this.form.get('value');
  }
}
