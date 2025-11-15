import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct page numbers', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    fixture.detectChanges();

    const pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(5); // 5 page buttons
    expect(pageButtons[0].nativeElement.textContent).toContain('1');
    expect(pageButtons[1].nativeElement.textContent).toContain('2');
  });

  it('should emit pageChange event when goToPage is called', () => {
    spyOn(component.pageChange, 'emit');
    component.totalPages = 5;
    component.goToPage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange event when nextPage is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 5;
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange event when previousPage is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 5;
    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(0);
  });

  it('should disable "Anterior" button on first page', () => {
    component.currentPage = 0;
    component.totalPages = 5;
    fixture.detectChanges();
    const previousButton = fixture.debugElement.query(By.css('button:first-child')).nativeElement;
    expect(previousButton.disabled).toBeTrue();
  });

  it('should disable "Próximo" button on last page', () => {
    component.currentPage = 4;
    component.totalPages = 5;
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('button:last-child')).nativeElement;
    expect(nextButton.disabled).toBeTrue();
  });
});
