import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/userModel';
import { RentalItemService } from '../../../services/rental-item.service';
import { roomInfo } from '../../../shared/models/roomInfo';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'], // 確保這裡是陣列格式
})
export class PublishComponent implements OnInit {
  userInfo: User | null = null; // 用戶信息
  roomInfo: roomInfo[][] = []; // 房屋信息


  constructor(
    private userService: UserService,
    private roomService: RentalItemService
  ) {}

  ngOnInit(): void {
    this.userService.refreshUser().subscribe({
      next: () => {
        this.userInfo = this.userService.currentUser;
        console.log(this.userInfo);

        if (this.userInfo?.properties?.length) {
          this.userInfo.properties.forEach((property) => {
            if (property._id) {
              this.roomService.findInfo(property._id).subscribe({
                next: (res) => {
                  this.roomInfo.push(res); // 不使用展開運算符，假設每次返回單個房屋資訊
                },
                error: (error) => {
                  console.error('Error fetching room information:', error);
                },
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Error refreshing user:', error);
      },
    });
  }
}
