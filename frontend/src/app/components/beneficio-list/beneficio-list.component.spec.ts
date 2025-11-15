import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BeneficioListComponent } from './beneficio-list.component';
import { Beneficio } from '../../model/beneficio';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;

  const mockBeneficios: Beneficio[] = [
    { id: 1, name: 'Beneficio 1', description: 'Desc 1', value: 100, active: true, version: 1 },
    { id: 2, name: 'Beneficio 2', description: 'Desc 2', value: 200, active: true, version: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BeneficioListComponent,
        LoadingSpinnerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner: DebugElement = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeTruthy();
  });

  it('should not display loading spinner when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const spinner: DebugElement = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeFalsy();
  });

  it('should display a list of beneficios', () => {
    component.beneficios = mockBeneficios;
    fixture.detectChanges();
    const beneficioElements = fixture.debugElement.queryAll(By.css('.border.rounded-lg'));
    expect(beneficioElements.length).toBe(2);
    const firstBeneficio = beneficioElements[0].nativeElement;
    expect(firstBeneficio.querySelector('h3').textContent).toContain('Beneficio 1');
  });

  it('should emit add event on onAdd', () => {
    spyOn(component.add, 'emit');
    component.onAdd();
    expect(component.add.emit).toHaveBeenCalled();
  });

  it('should emit edit event with beneficio on onEdit', () => {
    spyOn(component.edit, 'emit');
    const beneficio = mockBeneficios[0];
    component.onEdit(beneficio);
    expect(component.edit.emit).toHaveBeenCalledWith(beneficio);
  });

  it('should emit delete event with id on onDelete', () => {
    spyOn(component.delete, 'emit');
    component.onDelete(1);
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

  it('should emit pageChange event on onPageChange', () => {
    spyOn(component.pageChange, 'emit');
    component.onPageChange(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
