import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReserveService } from '../../services/reserve.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/userModel';
import { ReserveMessage } from '../../shared/models/reserveMessage';
import { Types } from 'mongoose';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-reserve-list',
  templateUrl: './reserve-list.component.html',
  styleUrls: ['./reserve-list.component.scss'],
})
export class ReserveListComponent implements OnInit {
  reservations: ReserveMessage[] = [];
  user: User | undefined;
  landlord: User[] = [];
  searchItem: ReserveMessage[] = [];
  isDialogVisible = false;
  selectedItem: any = null;

  constructor(
    private reserveService: ReserveService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {
    // Potential null check
    this.user = this.userService.currentUser;
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges(); // 強制刷新 DOM 佈局
  }
  ngOnInit() {
    // Add null checks and error handling
    if (this.user?._id) {
      this.reserveService.getReserveInfo(this.user._id).subscribe({
        next: (response) => {
          this.landlord = response.landlords;
          this.reservations = response.reservation;
          this.searchItem = response.reservation;

          console.log(response);
        },
        error: (err) => {
          console.error('Error fetching reserve info:', err);
        },
      });
    }
  }

  getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous'; // crossOrigin avoid from cross different domain warning
      img.src = url; //Anonymous to avoid CORS , (CORS is a security feature that restricts cross-origin HTTP requests.)
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement('canvas'); // canvas is a DOM element can be used to draw images and text
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0); //ctx is a 2D context for drawing on the canvas
    var dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
  searchReservations(searchTerm: string) {
    // 如果搜索词为空，显示所有预约
    if (searchTerm.trim() === '') {
      this.searchItem = this.reservations;
      return;
    }

    // 转换为小写以进行不区分大小写的搜索
    const searchTermLower = searchTerm.toLowerCase();

    this.searchItem = this.reservations.filter((reservation) => {
      return (
        // 搜索房间标题
        reservation.room_title?.toLowerCase().includes(searchTermLower) ||
        // 搜索预约信息
        reservation.message?.toLowerCase().includes(searchTermLower)
      );
    });
  }
  getLandlordName(client: ReserveMessage): string {
    if (!this.landlord || this.landlord.length === 0) {
      return '未知'; // 避免在 landlord 尚未加載時訪問
    }

    for (let landInfo of this.landlord) {
      if (landInfo._id === client.landlord_id) {
        return landInfo.name || '未知';
      }
    }
    return '未知'; // If no landlord found
  }

  getLandlordPhone(client: ReserveMessage): string {
    if (!this.landlord || this.landlord.length === 0) {
      return '未知'; // 避免在 landlord 尚未加載時訪問
    }

    for (let landInfo of this.landlord) {
      if (landInfo._id === client.landlord_id) {
        return landInfo.phone || '未知';
      }
    }
    return '未知'; // If no landlord found
  }
  getLandlordImg(client: ReserveMessage): string{
    
    for (let landInfo of this.landlord) {
      if (landInfo._id === client.landlord_id) {
        console.log(landInfo.properties[0].img_link[0]);
        return landInfo.properties[0].img_link[0];
      }
    }
    return '未知';
  }
  openDialog(item: any) {
    this.selectedItem = item;
    this.isDialogVisible = true;
  }
  closeDialog() {
    this.isDialogVisible = false;
    this.selectedItem = null;
  }
}
