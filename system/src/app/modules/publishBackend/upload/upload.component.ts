import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentalItemService } from '../../../services/rental-item.service';
import { Types } from 'mongoose'; // If you're using mongoose types for ObjectId
import { city_sample } from '../../../../data';
import { TreeNode } from 'primeng/api';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import { roomInfo } from '../../../shared/models/roomInfo';
import { format, resolve } from 'path';
import { formatDate } from '@angular/common';
import { async, tap } from 'rxjs';
import { rejects } from 'assert';
import { UserService } from '../../../services/user.service';
import { time, timeStamp } from 'console';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'], // Fixed typo 'styleUrl' -> 'styleUrls'
})
export class UploadComponent implements OnInit {
  binaryData: string | ArrayBuffer | null | undefined | any = [];
  Image: { images: Blob[] } = { images: [] };
  issubmit: boolean = false;
  public uploadForm!: FormGroup;
  city: TreeNode<string>[] = city_sample;

  selectedCities: string[] = [];
  constructor(
    private fb: FormBuilder,
    private roomService: RentalItemService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['',Validators.required], // 房屋標題
      street_number: ['',Validators.required], // 街道及門牌號碼
      special_features: [''], // 房屋的特殊功能或亮點
      short_term_rent: [false], // 是否接受短租, default to false
      rent: ['',Validators.required], // 租金金額
      parking_description: [''], // 停車位的描述
      parking: [false], // 是否有停車位, default to false
      orientation: [''], // 房屋的朝向
      nearby_transportation: [''], // 鄰近的交通設施
      nearby_schools: [''], // 鄰近的學校
      nearby_parks: [''], // 鄰近的公園
      nearby_markets: [''], // 鄰近的市場或商場
      map_url: [''], // 房屋位置的地圖鏈接
      management_method: [false], // 管理方式（例如包租或自主管理）, default to false
      management_fee: [null], // 管理費用
      legal_use: [''], // 合法用途（例如住宅、商業）
      images: [[],Validators.required], // 房屋圖片的文件名或鏈接, initialized as an empty array
      id: [''], // 房屋的唯一識別碼
      floor: ['',Validators.required], // 房屋所在樓層
      equipment: [''], // 房屋內的設備（例如家具）
      district: ['',Validators.required], // 房屋所在區域
      description: [''], // 房屋的描述或介紹
      deposit: ['',Validators.required], // 押金金額
      contact_info: this.fb.group({
        phone: ['',Validators.required], // 聯絡電話
        line_id: [''], // LINE 聯絡方式
      }),
      city: ['',Validators.required], // 房屋所在城市
      area: ['',Validators.required], // 房屋的面積(單位：平方米)
      type: ['',Validators.required], // 房屋類型(例如套房、整層)
      has_window: [false], // 是否有窗戶, default to false
    });
  }
  changeToggle(event: MultiSelectChangeEvent) {
    this.selectedCities = event.value[0]?.children?.map(
      (child: { label: any }) => child.label
    );
  }

 

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || input.files!.length === 0) {
      console.log('not decide any file');
      return;
    }

    Array.from(input.files!).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.Image.images.push(file);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  get fc() {
    return this.uploadForm.controls;
  }

  async submit() {
    this.issubmit = true;
    if(this.uploadForm.invalid){
      return;
    }
    // Map the form data to match the roomInfo interface
    const roomInfos: roomInfo = {
      _id: new Types.ObjectId(), // Use new ObjectId() if required for MongoDB
      title: this.fc['title'].value,
      rent: this.fc['rent'].value,
      type: this.fc['type'].value,
      city: this.fc['city'].value[0].label as string,
      district: this.fc['district'].value[0] as string,
      street_number: this.fc['street_number'].value,
      description: this.fc['description'].value,

      has_window: this.fc['has_window'].value || false,

      floor: this.fc['floor'].value,
      legal_use: this.fc['legal_use'].value,
      orientation: this.fc['orientation'].value,
      area: this.fc['area'].value,
      short_term_rent: this.fc['short_term_rent'].value,
      deposit: this.fc['deposit'].value,
      parking: this.fc['parking'].value,
      parking_description: this.fc['parking_description'].value,
      management_method: this.fc['management_method'].value,
      management_fee: this.fc['management_fee'].value,
      equipment: this.fc['equipment'].value,
      special_features: this.fc['special_features'].value,
      map_url: this.fc['map_url'].value,
      nearby_schools: this.fc['nearby_schools'].value,
      nearby_markets: this.fc['nearby_markets'].value,
      nearby_parks: this.fc['nearby_parks'].value,
      nearby_transportation: this.fc['nearby_transportation'].value,
      // images: await Promise.all(this.Image.images.map(async (blob: Blob) => Buffer.from(await blob.arrayBuffer()))),
      images: [],
      contact_info: {
        phone: this.fc['contact_info'].get('phone')?.value,
        line_id: this.fc['contact_info'].get('line_id')?.value,
      },
      ownership_registration: false,
      material: '',
      landlord_id: this.userService.currentUser._id,
      element: undefined
    };
    const formData = new FormData();
    this.Image.images.forEach((files) => {
      formData.append('files', files);
    });
    // Send roomInfo object to the service
    
    this.roomService.uploadImg(formData).subscribe((res: Array<any>) => {
      roomInfos.images = res;
      
      this.roomService.upload(roomInfos).subscribe((roomId: any) => {
        const userId = this.userService.currentUser._id; 
        const properties = [
          {
            _id: roomId, 
            title: roomInfos['title'], 
            img_link: roomInfos.images, 
          },
        ];

        this.userService.updateRoom(userId, properties).subscribe((response) => {
          console.log('User updated successfully:', response);
        });
      });
    });
  }
}
