import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../model/beneficio';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.html',
  styleUrls: ['./transfer-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TransferFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly beneficioService = inject(BeneficioService);

  @Output() transferComplete = new EventEmitter<void>();

  form!: FormGroup;
  beneficios = signal<Beneficio[]>([]);
  transferSuccess = signal(false);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fromId: [null, Validators.required],
      toId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    // Load all benefits for the dropdowns
    this.beneficioService.findAll(0, 1000).subscribe(data => {
      this.beneficios.set(data.content);
    });
  }

  get fromId() {
    return this.form.get('fromId');
  }
  get toId() {
    return this.form.get('toId');
  }
  get amount() {
    return this.form.get('amount');
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { fromId, toId, amount } = this.form.value;

    if (fromId === toId) {
      this.toId?.setErrors({ mesmaConta: true });
      return;
    }

    const beneficioOrigem = this.beneficios().find(b => b.id === fromId);
    if (!beneficioOrigem || amount > beneficioOrigem.value) {
      this.amount?.setErrors({ saldoInsuficiente: true });
      return;
    }

    this.beneficioService.transfer(fromId, toId, amount).subscribe(() => {
      this.transferSuccess.set(true);
      this.form.reset();
      this.transferComplete.emit();
      this.loadBeneficios(); // Refresh dropdowns
      setTimeout(() => this.transferSuccess.set(false), 3000);
    });
  }
}
