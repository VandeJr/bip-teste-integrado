import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BeneficioListComponent } from '../beneficio-list/beneficio-list.component';
import { TransferFormComponent } from '../transfer-form/transfer-form';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../model/beneficio';
import { finalize } from 'rxjs';
import { ModalComponent } from '../modal/modal';
import { BeneficioFormComponent } from '../beneficio-form/beneficio-form';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BeneficioListComponent,
    TransferFormComponent,
    ModalComponent,
    BeneficioFormComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private readonly beneficioService = inject(BeneficioService);

  @ViewChild(TransferFormComponent) transferForm!: TransferFormComponent;

  public beneficios = signal<Beneficio[]>([]);
  public totalElements = signal(0);
  public totalPages = signal(0);
  public loading = signal(false);
  protected page = 0;
  protected size = 6; // Adjusted size for better layout

  isBeneficioModalOpen = false;
  editingBeneficio: Beneficio | null = null;

  isDeleteModalOpen = false;
  beneficioIdToDelete: number | null = null;

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.loading.set(true);
    this.beneficioService.findAll(this.page, this.size)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(data => {
        this.beneficios.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
      });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadBeneficios();
  }

  onAdd(): void {
    this.editingBeneficio = null;
    this.isBeneficioModalOpen = true;
  }

  onEdit(beneficio: Beneficio): void {
    this.editingBeneficio = beneficio;
    this.isBeneficioModalOpen = true;
  }

  onDelete(beneficioId: number): void {
    this.beneficioIdToDelete = beneficioId;
    this.isDeleteModalOpen = true;
  }

  onCloseBeneficioModal(): void {
    this.isBeneficioModalOpen = false;
    this.editingBeneficio = null;
  }

  onSaveBeneficio(beneficio: Beneficio): void {
    const operation = beneficio.id
      ? this.beneficioService.update(beneficio.id, beneficio)
      : this.beneficioService.create(beneficio);

    operation.subscribe(() => {
      this.onCloseBeneficioModal();
      this.loadBeneficios();
      this.transferForm.loadBeneficios();
    });
  }

  onTransferComplete(): void {
    this.loadBeneficios();
  }

  onConfirmDelete(): void {
    if (this.beneficioIdToDelete) {
      this.beneficioService.delete(this.beneficioIdToDelete).subscribe(() => {
        this.loadBeneficios();
        this.transferForm.loadBeneficios();
        this.onCancelDelete();
      });
    }
  }

  onCancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.beneficioIdToDelete = null;
  }
}
