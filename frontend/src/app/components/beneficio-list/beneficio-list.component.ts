import { Component, inject, OnInit, signal } from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../model/beneficio';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, PaginationComponent]
})
export class BeneficioListComponent implements OnInit {
  private readonly beneficioService = inject(BeneficioService);

  public beneficios = signal<Beneficio[]>([]);
  public totalElements = signal(0);
  public totalPages = signal(0);
  public loading = signal(false);
  protected page = 0;
  protected size = 10;

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

  deleteBeneficio(beneficioId: number): void {
    if (confirm('Tem certeza que deseja excluir este benefício?')) {
      this.beneficioService.delete(beneficioId).subscribe(() => {
        this.loadBeneficios();
      });
    }
  }
}
