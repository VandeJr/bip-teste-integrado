import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BeneficioFormComponent } from './beneficio-form';
import { Beneficio } from '../../model/beneficio';
import { SimpleChange } from '@angular/core';

describe('BeneficioFormComponent', () => {
  let component: BeneficioFormComponent;
  let fixture: ComponentFixture<BeneficioFormComponent>;

  const mockBeneficio: Beneficio = { id: 1, name: 'Beneficio 1', description: 'Desc 1', value: 100, active: true, version: 1 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BeneficioFormComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an invalid form on init', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.form.controls['name'].setValue('Test');
    component.form.controls['description'].setValue('Test desc');
    component.form.controls['value'].setValue(100);
    expect(component.form.valid).toBeTruthy();
  });

  it('should display error message when form is invalid and touched', () => {
    const nameControl = component.form.get('name');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.text-red-500');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('O nome é obrigatório.');
  });

  it('should emit save event with form value on valid submission', () => {
    spyOn(component.save, 'emit');
    component.form.setValue(mockBeneficio);
    component.onSubmit();
    expect(component.save.emit).toHaveBeenCalledWith(mockBeneficio);
  });

  it('should not emit save event on invalid submission', () => {
    spyOn(component.save, 'emit');
    component.onSubmit(); // Form is invalid
    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event on onCancel', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  describe('edit mode', () => {
    it('should patch form when beneficio input is set', () => {
      component.beneficio = mockBeneficio;
      component.ngOnChanges({
        beneficio: new SimpleChange(null, mockBeneficio, true)
      });
      fixture.detectChanges();
      expect(component.form.value).toEqual(mockBeneficio);
    });

    it('should reset form when beneficio input changes to null', () => {
      // First, set to edit mode
      component.beneficio = mockBeneficio;
      component.ngOnChanges({
        beneficio: new SimpleChange(null, mockBeneficio, true)
      });
      fixture.detectChanges();
      expect(component.form.value).toEqual(mockBeneficio);

      // Then, change to create mode
      component.beneficio = null;
      component.ngOnChanges({
        beneficio: new SimpleChange(mockBeneficio, null, false)
      });
      fixture.detectChanges();

      // Expect form to be reset, keeping default values
      expect(component.form.value.id).toBeNull();
      expect(component.form.value.name).toBeNull();
      expect(component.form.value.active).toBe(true);
    });
  });
});
