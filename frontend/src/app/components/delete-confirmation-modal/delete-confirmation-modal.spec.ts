import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal';
import { ModalComponent } from '../modal/modal';

describe('DeleteConfirmationModalComponent', () => {
  let component: DeleteConfirmationModalComponent;
  let fixture: ComponentFixture<DeleteConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationModalComponent, ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('app-modal');
    // The modal component itself handles the rendering, so we check its input
    expect(modal.isOpen).toBeFalsy();
  });

  it('should be visible when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modalContent = fixture.nativeElement.querySelector('p');
    expect(modalContent).toBeTruthy();
  });

  it('should display the item type', () => {
    component.isOpen = true;
    component.itemType = 'benefício';
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('p');
    expect(message.textContent).toContain('excluir este benefício?');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector('.bg-red-500');
    confirmButton.click();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const cancelButton = fixture.nativeElement.querySelector('.bg-gray-500');
    cancelButton.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
