import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { roomInfo } from '../shared/models/roomInfo';
import {
  
  ROOMINFOFIND_URL,
  ROOMINFOGET_URL,
  ROOMINFORESULT_URL,
  UPLOAD_URL,
  UPLOADIMG_URL,
} from '../shared/constants/urls';


@Injectable({
  providedIn: 'root',
})
export class RentalItemService {
  public roomInfos: BehaviorSubject<roomInfo[]> = new BehaviorSubject<
    roomInfo[]
  >([]);
  public roomResults: BehaviorSubject<roomInfo[]> = new BehaviorSubject<
    roomInfo[]
  >([]);
  public currentUserResult: BehaviorSubject<roomInfo[]> = new BehaviorSubject<
    roomInfo[]
  >([]);

  constructor(private http: HttpClient) {}

  // 獲取所有房屋信息
  getInfo(): Observable<roomInfo[]> {
    return this.http.get<roomInfo[]>(ROOMINFOGET_URL).pipe(
      tap((result: roomInfo[]) => {
        this.roomInfos.next(result); // 更新 BehaviorSubject 的值
        this.setAllRoom(result); // 保存所有房屋信息到本地存儲
      })
    );
  }

  // 根據 ID 查詢房屋信息
  findInfo(id: string): Observable<roomInfo[]> {
    const params = new HttpParams().set('id', id); // 傳遞查詢參數
    return this.http.get<roomInfo[]>(ROOMINFOFIND_URL, { params }).pipe(
      tap((result: roomInfo[]) => {
        this.roomInfos.next(result);
        console.log(result);
      })
    );
  }


  uploadImg(files:any): Observable<any> {
    
    console.log(files)
    return this.http.post<roomInfo>(UPLOADIMG_URL, files)
     
    
  }
 upload(files: roomInfo): Observable<any> {
   console.log(files);
   return this.http.post<roomInfo>(UPLOAD_URL, files).pipe(
     map((response: any) => {
       // 在這裡可以對回傳的資料進行處理
       console.log(response);
       // 返回處理後的資料
       return response;
     })
   );
 }
  // 根據條件獲取房屋結果
  getRoomResult(
query: Array<any>): Observable<roomInfo[]> {
    console.log(query);
    let params = new HttpParams();
    
    if (query[0].city) params = params.set('city', query[0].city);
    if (query[0].district) params = params.set('district', query[0].district);
    if (query[0].type) params = params.set('type',  query[0].type);
    if (query[0].rent) params = params.set('rent',  query[0].rent);
    if(query[0].floor) params = params.set('floor',  query[0].floor);
    if(query[0].room) params = params.set('room',  query[0].room);
    if(query[0].keyword) params = params.set('keyword',  query[0].keyword);
    return this.http.get<roomInfo[]>(ROOMINFORESULT_URL, { params }).pipe(
      tap((result: roomInfo[]) => {
        console.log(result);
        this.roomResults.next(result); // 更新搜索結果的 BehaviorSubject
        this.setSearchRoom(result); // 保存搜索結果到本地存儲
      })
    );
  }

  // 取得所有房屋信息的 Observable
  getRoomInfos(): Observable<roomInfo[]> {
    return this.roomInfos.asObservable();
  }

  // 保存所有房屋信息到 localStorage
  setAllRoom(roomInfos: roomInfo[]): void {
    localStorage.setItem('roomInfo', JSON.stringify(roomInfos));
  }

  // 保存搜索結果到 localStorage
  setSearchRoom(roomResults: roomInfo[]): void {
    localStorage.setItem('roomResults', JSON.stringify(roomResults));
  }

  // 根據 ID 獲取特定房屋信息
  getRoomById(_id: string): roomInfo | undefined {
    try {
      const rooms = JSON.parse(
        localStorage.getItem('roomInfo') || '[]'
      ) as roomInfo[];
      return rooms.find((room) => room._id.toString() === _id);
    } catch (error) {
      console.error('Failed to parse roomInfo from localStorage', error);
      return undefined;
    }
  }
}
