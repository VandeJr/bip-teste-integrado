import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed.inset-0'));
    expect(modalElement).toBeFalsy();
  });

  it('should be visible when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed.inset-0'));
    expect(modalElement).toBeTruthy();
  });

  it('should display the title', () => {
    component.isOpen = true;
    component.title = 'Test Modal';
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent).toContain('Test Modal');
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when backdrop is clicked', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('[data-testid="modal-backdrop"]')).nativeElement;
    backdrop.click();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
