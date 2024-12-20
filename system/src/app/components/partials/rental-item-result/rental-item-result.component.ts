import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RentalItemService } from '../../../services/rental-item.service';
import { roomInfo } from '../../../shared/models/roomInfo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rental-itemm-result',
  templateUrl: './rental-item-result.component.html',
  styleUrls: ['./rental-item-result.component.scss'],
})
export class RentalItemResultComponent implements OnInit, AfterViewInit {

  @ViewChild('holder', { static: false }) holder!: ElementRef;

  @Input() result: roomInfo[] = [];
  isSearch =false
  constructor(private route: ActivatedRoute, private rentalItem: RentalItemService, private router: Router) {
    this.result = this.route.snapshot.data['result'] || [];
    this.isSearch = this.result.length > 0;
  }
  
  
 
  ngOnInit(): void {
    // 確保我們從路由的狀態獲取結果
    const stateData = history.state;
    if (stateData && stateData.result) {
      this.result = stateData.result;
      console.log('Result from state:', this.result);
    } 
  }
  

  ngAfterViewInit(): void {
    this.holder.nativeElement.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      // 確保 target 是 .sortBtn 或者是 sortBtn 的子元素（例如 i 標籤）
      const sortButton = target.closest('.sortBtn') as HTMLElement;
      if (sortButton) {
        this.handleSortClick(sortButton);
      }
    });
  }
  handleHolderClick(e: Event) {
    const target = (e.target as HTMLElement).closest('.sortBtn') as HTMLElement;
    if (target) {
      this.handleSortClick(target);
    }
  }
  handleSortClick(target: HTMLElement) {
    // 獲取當前點擊的按鈕內的圖標
    const icon = target.querySelector ('.pi-chevron-down') as HTMLElement;

    // 切換 `down` 類別
    if (icon) {
      if (icon.classList.contains('down')) {
        icon.classList.remove('down');
      } else {
        icon.classList.add('down');
      }
    }
    
    const sortName = target.getAttribute('name');
    switch (sortName) {
      case 'sortTime':
        this.result.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => (a['key'] > b['key'] ? 1 : -1));
        break;
      case 'rental':
        this.result.sort((a: { rent: number; }, b: { rent: number; }) => (a.rent > b.rent ? 1 : -1));
        
        break;
      case 'totalSize':
        this.result.sort((a: { area: number; }, b: { area: number; }) => (a.area > b.area ? 1 : -1));
        
        break;
    }
  }
  detail(item: roomInfo) {
    this.router.navigate(['rental-info', item._id]);
  }
  reload() {
    window.location.reload();
    }
    
    isEmptyResult(): boolean {
      return this.result.length === 0;
    }
}
