import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TransferFormComponent } from './transfer-form';
import { BeneficioService } from '../../services/beneficio.service';
import { Page } from '../../model/page';
import { Beneficio } from '../../model/beneficio';

describe('TransferFormComponent', () => {
  let component: TransferFormComponent;
  let fixture: ComponentFixture<TransferFormComponent>;
  let beneficioService: BeneficioService;
  let router: Router;

  const mockBeneficiosPage: Page<Beneficio> = {
    content: [
      { id: 1, name: 'Beneficio 1', description: 'Desc 1', value: 100, active: true, version: 1 },
      { id: 2, name: 'Beneficio 2', description: 'Desc 2', value: 200, active: true, version: 1 }
    ],
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        TransferFormComponent
      ],
      providers: [BeneficioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferFormComponent);
    component = fixture.componentInstance;
    beneficioService = TestBed.inject(BeneficioService);
    router = TestBed.inject(Router);
    spyOn(beneficioService, 'findAll').and.returnValue(of(mockBeneficiosPage));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load beneficios on init', () => {
    expect(beneficioService.findAll).toHaveBeenCalled();
    expect(component.beneficios().length).toBe(2);
  });

  it('should create an invalid form on init', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should create a valid form when all fields are filled', () => {
    component.form.controls['fromId'].setValue(1);
    component.form.controls['toId'].setValue(2);
    component.form.controls['amount'].setValue(50);
    expect(component.form.valid).toBeTruthy();
  });

  it('should call transfer and emit event on submit', () => {
    spyOn(beneficioService, 'transfer').and.returnValue(of(undefined));
    spyOn(component.transferComplete, 'emit');

    component.form.controls['fromId'].setValue(1);
    component.form.controls['toId'].setValue(2);
    component.form.controls['amount'].setValue(50);

    component.onSubmit();

    expect(beneficioService.transfer).toHaveBeenCalledWith(1, 2, 50);
    expect(component.transferComplete.emit).toHaveBeenCalled();
  });
});
