import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BeneficioService } from '../../services/beneficio.service';
import { DashboardComponent } from './dashboard';
import { Page } from '../../model/page';
import { Beneficio } from '../../model/beneficio';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let beneficioService: BeneficioService;

  const mockBeneficiosPage: Page<Beneficio> = {
    content: [{ id: 1, name: 'Beneficio 1', description: 'Desc 1', value: 100, active: true, version: 1 }],
    totalElements: 1,
    totalPages: 1,
    size: 6,
    number: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DashboardComponent
      ],
      providers: [BeneficioService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    beneficioService = TestBed.inject(BeneficioService);
    spyOn(beneficioService, 'findAll').and.returnValue(of(mockBeneficiosPage));

    // Mock the ViewChild
    component.transferForm = {
      loadBeneficios: jasmine.createSpy('loadBeneficios')
    } as any;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load beneficios on init', () => {
    fixture.detectChanges(); // ngOnInit
    expect(beneficioService.findAll).toHaveBeenCalledWith(0, 6);
    expect(component.beneficios().length).toBe(1);
  });

  it('should open add modal on onAdd', () => {
    component.onAdd();
    expect(component.isBeneficioModalOpen).toBeTrue();
    expect(component.editingBeneficio).toBeNull();
  });

  it('should open edit modal with data on onEdit', () => {
    const beneficio = mockBeneficiosPage.content[0];
    component.onEdit(beneficio);
    expect(component.isBeneficioModalOpen).toBeTrue();
    expect(component.editingBeneficio).toBe(beneficio);
  });

  it('should open delete modal with id on onDelete', () => {
    component.onDelete(1);
    expect(component.isDeleteModalOpen).toBeTrue();
    expect(component.beneficioIdToDelete).toBe(1);
  });

  it('should close and reset on onCloseBeneficioModal', () => {
    component.isBeneficioModalOpen = true;
    component.editingBeneficio = mockBeneficiosPage.content[0];
    component.onCloseBeneficioModal();
    expect(component.isBeneficioModalOpen).toBeFalse();
    expect(component.editingBeneficio).toBeNull();
  });

  it('should call create and reload on onSaveBeneficio for new beneficio', () => {
    spyOn(beneficioService, 'create').and.returnValue(of({} as any));
    spyOn(component, 'loadBeneficios');
    const newBeneficio: Beneficio = { id: 0, name: 'New', description: 'New Desc', value: 50, active: true, version: 0 };
    component.onSaveBeneficio(newBeneficio);
    expect(beneficioService.create).toHaveBeenCalledWith(newBeneficio);
    expect(component.loadBeneficios).toHaveBeenCalled();
  });

  it('should call update and reload on onSaveBeneficio for existing beneficio', () => {
    spyOn(beneficioService, 'update').and.returnValue(of({} as any));
    spyOn(component, 'loadBeneficios');
    const existingBeneficio = mockBeneficiosPage.content[0];
    component.onSaveBeneficio(existingBeneficio);
    expect(beneficioService.update).toHaveBeenCalledWith(existingBeneficio.id, existingBeneficio);
    expect(component.loadBeneficios).toHaveBeenCalled();
  });

  it('should call delete and reload on onConfirmDelete', () => {
    spyOn(beneficioService, 'delete').and.returnValue(of(undefined));
    spyOn(component, 'loadBeneficios');
    component.beneficioIdToDelete = 1;
    component.onConfirmDelete();
    expect(beneficioService.delete).toHaveBeenCalledWith(1);
    expect(component.loadBeneficios).toHaveBeenCalled();
    expect(component.isDeleteModalOpen).toBeFalse();
  });

  it('should close and reset on onCancelDelete', () => {
    component.isDeleteModalOpen = true;
    component.beneficioIdToDelete = 1;
    component.onCancelDelete();
    expect(component.isDeleteModalOpen).toBeFalse();
    expect(component.beneficioIdToDelete).toBeNull();
  });

  it('should change page and reload on onPageChange', () => {
    spyOn(component, 'loadBeneficios');
    component.onPageChange(2);
    expect((component as any).page).toBe(2);
    expect(component.loadBeneficios).toHaveBeenCalled();
  });

  it('should reload on onTransferComplete', () => {
    spyOn(component, 'loadBeneficios');
    component.onTransferComplete();
    expect(component.loadBeneficios).toHaveBeenCalled();
  });
});
