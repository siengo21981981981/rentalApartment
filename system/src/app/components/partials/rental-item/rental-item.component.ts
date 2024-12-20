import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RentalItemService } from '../../../services/rental-item.service';
import { roomInfo } from '../../../shared/models/roomInfo';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rental-item',
  templateUrl: './rental-item.component.html',
  styleUrls: ['./rental-item.component.scss'],
})
export class RentalItemComponent implements OnInit {
  @ViewChild('holder', { static: false }) holder!: ElementRef;
  @Input() room: roomInfo[] = [];
  buttonName: string | null = null;

  constructor(private rantelItem: RentalItemService, private router: Router) {}

  ngOnInit(): void {
    this.rantelItem.getInfo().subscribe(async (e) => {
      this.room = e;
      // for (const element of this.room) {
      //   const images = await Promise.all(
      //     element.images.map((img) =>
      //       this.getBase64ImageFromURL(img as string).toPromise()
      //     )
      //   );
      //   element.images = images as string[];
      // }
    });
  }

  handleSortClick(target: HTMLElement) {
    const sortName = target.getAttribute('name');
    const icon = target.querySelector('.arrow-icon') as HTMLElement;

    if (this.buttonName && this.buttonName !== sortName) {
      const prevButton = document.querySelector(`[name="${this.buttonName}"]`);
      const prevIcon = prevButton?.querySelector('.arrow-icon') as HTMLElement;
      prevIcon?.classList.remove('up', 'down');
    }

    this.buttonName = sortName;

    const isDescending = icon.classList.toggle('down');
    icon.classList.toggle('up', !isDescending);

    const sortOrder = isDescending ? -1 : 1;
    this.sortRooms(sortName, sortOrder);
  }

  sortRooms(sortName: string | null, sortOrder: number) {
    switch (sortName) {
      case 'sortTime':
        this.room.sort((a, b) =>
          a['key'] > b['key'] ? sortOrder : -sortOrder
        );
        break;
      case 'rental':
        this.room.sort((a, b) => (a.rent - b.rent) * sortOrder);
        break;
      case 'totalSize':
        this.room.sort((a, b) => (a.area - b.area) * sortOrder);
        break;
    }
  }

  // getBase64ImageFromURL(url: string): Observable<string> {
  //   return new Observable((observer) => {
  //     const img = new Image();
  //     img.crossOrigin = 'Anonymous';
  //     img.src = url;
  //     img.onload = () => {
  //       observer.next(this.getBase64Image(img));
  //       observer.complete();
  //       console.log(img);
  //     };
  //     img.onerror = () => {
  //       observer.error(`圖片加載失敗: ${url}`);
  //     };
  //   });
  // }

  // getBase64Image(img: HTMLImageElement): string {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   const ctx = canvas.getContext('2d');
  //   ctx?.drawImage(img, 0, 0);
  //   return canvas
  //     .toDataURL('image/png')
  //     .replace(/^data:image\/(png|jpg);base64,/, '');
  // }

  detail(item: roomInfo): void {
    this.router.navigate(['rental-info', item._id]);
  }
}
