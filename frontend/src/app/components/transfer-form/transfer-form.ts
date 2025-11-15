import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  private readonly router = inject(Router);

  form!: FormGroup;
  beneficios = signal<Beneficio[]>([]);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fromId: [null, Validators.required],
      toId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
    this.loadBeneficios();
  }

  loadBeneficios(): void {
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
      console.error('Formulário inválido (erros padrão).');
      return;
    }

    const { fromId, toId, amount } = this.form.value;

    if (fromId === toId) {
      this.toId?.setErrors({ mesmaConta: true });
      return;
    }

    const beneficioOrigem = this.beneficios().find(b => b.id === fromId);

    if (!beneficioOrigem) {
      console.error('Benefício de origem não encontrado!');
      return;
    }

    if (amount > beneficioOrigem.value) {
      this.amount?.setErrors({ saldoInsuficiente: true });
      return;
    }

    console.log('Formulário válido! Enviando transferência...');
    this.beneficioService.transfer(fromId, toId, amount).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
