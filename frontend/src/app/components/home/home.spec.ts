import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HomeComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the welcome message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Bem-vindo ao BIP - Gestão de Benefícios');
  });

  it('should display the navigation buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('a');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Ver Benefícios');
    expect(buttons[1].textContent).toContain('Realizar Transferência');
  });
});
