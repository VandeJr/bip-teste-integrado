import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Beneficio } from '../../model/beneficio';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, PaginationComponent]
})
export class BeneficioListComponent {
  @Input() beneficios: Beneficio[] = [];
  @Input() totalElements: number = 0;
  @Input() totalPages: number = 0;
  @Input() loading: boolean = false;
  @Input() currentPage: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Beneficio>();
  @Output() add = new EventEmitter<void>();

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }

  onAdd(): void {
    this.add.emit();
  }

  onEdit(beneficio: Beneficio): void {
    this.edit.emit(beneficio);
  }

  onDelete(beneficioId: number): void {
    this.delete.emit(beneficioId);
  }
}
