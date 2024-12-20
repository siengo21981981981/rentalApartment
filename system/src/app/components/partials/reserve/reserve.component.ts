import {
  NgModule,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ReserveService } from '../../../services/reserve.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { RentalItemService } from '../../../services/rental-item.service';
import { ReserveMessage } from '../../../shared/models/reserveMessage';
import { Types } from 'mongoose';
import { roomInfo } from '../../../shared/models/roomInfo';
import { HeaderComponent } from '../../../components/partials/header/header.component';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
})
export class ReserveComponent implements OnInit, AfterViewInit {
  handleButton() {
    
      this.messageService.add({
        severity: 'error',
        summary: '請先登入',
        key: 'login',
      });

     
  }

  public ReserveForm!: FormGroup;
  message: string = '我對這個物件有興趣，還請協助安排預約看屋時間';
  btnText: string = '預約看屋';
  userInfo: any;
  roomResults: any;
  isLogin: boolean ;
  isSubmit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private reserveService: ReserveService,
    private messageService: MessageService,
    private rentalItemService: RentalItemService,
    private route: ActivatedRoute
  ) {
    this.userInfo = this.userService.currentUser;
    this.isLogin = this.userService.isLogin;
    
    this.roomResults = this.rentalItemService.getRoomById(
      this.route.snapshot.paramMap.get('id') || ''
    );
  }

  ngOnInit(): void {
    console.log(this.roomResults.landlord);
    this.ReserveForm = this.fb.group({
      type: ['0', Validators.required], // 預設選擇回電解說
      name: [this.userInfo?.name || '', [Validators.required]],
      salutation: ['0', Validators.required], // 預設選擇先生
      phone: [
        this.userInfo?.phone || '',
        [Validators.required, Validators.pattern('09\\d{8}')],
      ],
      email: [this.userInfo?.email || '', [Validators.email]],
      message: [''],
    });

    // 監聽 type 變更
    this.ReserveForm.get('type')?.valueChanges.subscribe((value) => {
      this.updateMessageAndButton(value);
    });
  }

  ngAfterViewInit(): void {
    this.updateActiveState();
  }
  get fc() {
    return this.ReserveForm.controls;
  }
  private updateMessageAndButton(value: string): void {
    const input = document.querySelector(
      `input[value="${value}"].r-radio-button__input`
    );
    if (input) {
      this.message = input.getAttribute('data-default-msg') || '';
      this.btnText = input.getAttribute('data-btn-text') || '';
      this.updateActiveState();
    }
  }

  private updateActiveState(): void {
    const wrappers = document.querySelectorAll('.r-radio-button__wrapper');
    wrappers.forEach((wrapper) => wrapper.classList.remove('active'));

    const selectedValue = this.ReserveForm.get('type')?.value;
    const selectedInput = document.querySelector(
      `input[value="${selectedValue}"].r-radio-button__input`
    );
    if (selectedInput) {
      const wrapper = selectedInput.closest('.r-radio-button__wrapper');
      if (wrapper) {
        wrapper.classList.add('active');
      }
    }
  }

  onSubmit(): void {
    this.isSubmit = true;
    if (  this.ReserveForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: '成功送出',
        key: 'confirm',
      });
      if (this.ReserveForm.get('message')?.value == '') {
        this.ReserveForm.get('message')?.setValue(this.message);
      }
      let query: ReserveMessage[] = [
        {
          _id: new Types.ObjectId(),
          client_id: this.userInfo._id,
          landlord_id: this.roomResults.landlord,
          contactphone: this.ReserveForm.get('phone')?.value,
          email: this.ReserveForm.get('email')?.value,
          reservationtype:
            this.ReserveForm.get('type')?.value == '1' ? '回電解說' : '預約回電',
          reservationtime: new Date(),
          message: this.ReserveForm.get('message')?.value,
          room_title: this.roomResults.title,
        },
      ];
      console.log('表單資料：', query);
      this.reserveService.upload(query).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: '預約成功' });
      });
    }else{
      this.messageService.add({
        severity: 'error',
        summary: '請輸入訊息內容',
        key: 'confirm',
      });
    }

    
  }
}
