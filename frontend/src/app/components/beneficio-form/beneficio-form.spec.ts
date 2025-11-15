import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BeneficioFormComponent } from './beneficio-form';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../model/beneficio';

describe('BeneficioFormComponent', () => {
  let component: BeneficioFormComponent;
  let fixture: ComponentFixture<BeneficioFormComponent>;
  let beneficioService: BeneficioService;
  let router: Router;

  describe('create mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([]),
          BeneficioFormComponent
        ],
        providers: [BeneficioService]
      })
      .compileComponents();

      fixture = TestBed.createComponent(BeneficioFormComponent);
      component = fixture.componentInstance;
      beneficioService = TestBed.inject(BeneficioService);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create an invalid form on init', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should create a valid form when all fields are filled', () => {
      component.form.controls['name'].setValue('Test');
      component.form.controls['description'].setValue('Test desc');
      component.form.controls['value'].setValue(100);
      expect(component.form.valid).toBeTruthy();
    });

    it('should call create and navigate on submit', () => {
      spyOn(beneficioService, 'create').and.returnValue(of({} as any));
      spyOn(router, 'navigate');

      component.form.controls['name'].setValue('Test');
      component.form.controls['description'].setValue('Test desc');
      component.form.controls['value'].setValue(100);

      component.onSubmit();

      expect(beneficioService.create).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should display error message when form is invalid and touched', () => {
      const nameControl = component.form.get('name');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.text-red-500');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toContain('Campo obrigatório.');
    });
  });

  describe('edit mode', () => {
    const mockBeneficio: Beneficio = { id: 1, name: 'Beneficio 1', description: 'Desc 1', value: 100, active: true, version: 1 };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([]),
          BeneficioFormComponent
        ],
        providers: [
          BeneficioService,
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: convertToParamMap({ id: '1' })
              }
            }
          }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(BeneficioFormComponent);
      component = fixture.componentInstance;
      beneficioService = TestBed.inject(BeneficioService);
      router = TestBed.inject(Router);
      spyOn(beneficioService, 'findById').and.returnValue(of(mockBeneficio));
      fixture.detectChanges();
    });

    it('should load beneficio data on init', () => {
      expect(beneficioService.findById).toHaveBeenCalledWith(1);
      expect(component.form.value).toEqual(mockBeneficio);
    });

    it('should call update and navigate on submit', () => {
      spyOn(beneficioService, 'update').and.returnValue(of({} as any));
      spyOn(router, 'navigate');

      component.onSubmit();

      expect(beneficioService.update).toHaveBeenCalledWith(1, mockBeneficio);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
