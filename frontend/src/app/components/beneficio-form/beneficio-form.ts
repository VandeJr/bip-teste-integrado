import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../model/beneficio';

@Component({
  selector: 'app-beneficio-form',
  templateUrl: './beneficio-form.html',
  styleUrls: ['./beneficio-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class BeneficioFormComponent implements OnInit, OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() beneficio: Beneficio | null = null;
  @Output() save = new EventEmitter<Beneficio>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      value: [null, [Validators.required, Validators.min(0)]],
      active: [true],
      version: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficio'] && this.form) {
      if (this.beneficio) {
        this.form.patchValue(this.beneficio);
      } else {
        this.form.reset({ active: true });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
  }

  onCancel(): void {
    this.cancel.emit();
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
