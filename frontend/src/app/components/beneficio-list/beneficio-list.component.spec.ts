import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BeneficioListComponent } from './beneficio-list.component';
import { BeneficioService } from '../../services/beneficio.service';
import { of, Subject } from 'rxjs';
import { Page } from '../../model/page';
import { Beneficio } from '../../model/beneficio';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;
  let beneficioService: BeneficioService;

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
        RouterTestingModule,
        BeneficioListComponent,
        LoadingSpinnerComponent
      ],
      providers: [BeneficioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
    beneficioService = TestBed.inject(BeneficioService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner and then load beneficios on init', fakeAsync(() => {
    const findAllSubject = new Subject<Page<Beneficio>>();
    spyOn(beneficioService, 'findAll').and.returnValue(findAllSubject.asObservable());

    fixture.detectChanges(); // ngOnInit()

    expect(component.loading()).toBe(true);
    let spinner: DebugElement = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeTruthy();

    findAllSubject.next(mockBeneficiosPage);
    findAllSubject.complete();
    tick();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    spinner = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeFalsy();

    expect(beneficioService.findAll).toHaveBeenCalledWith(0, 10);
    expect(component.beneficios().length).toBe(2);
    expect(component.totalElements()).toBe(2);
    expect(component.totalPages()).toBe(1);
    expect(component.beneficios()[0].name).toBe('Beneficio 1');
  }));

  it('should delete a beneficio and reload the list if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(beneficioService, 'delete').and.returnValue(of(undefined));
    spyOn(beneficioService, 'findAll').and.returnValue(of(mockBeneficiosPage));

    component.deleteBeneficio(1);

    expect(window.confirm).toHaveBeenCalled();
    expect(beneficioService.delete).toHaveBeenCalledWith(1);
    expect(beneficioService.findAll).toHaveBeenCalled();
  });

  it('should not delete a beneficio if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(beneficioService, 'delete').and.returnValue(of(undefined));

    component.deleteBeneficio(1);

    expect(window.confirm).toHaveBeenCalled();
    expect(beneficioService.delete).not.toHaveBeenCalled();
  });

  it('should change page and reload beneficios', () => {
    spyOn(component, 'loadBeneficios');
    component.onPageChange(1);
    expect((component as any).page).toBe(1);
    expect(component.loadBeneficios).toHaveBeenCalled();
  });
});
