import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ReserveMessage } from '../shared/models/reserveMessage';
import { RESERVEGET_URL, RESERVERUPLOAD_URL } from '../shared/constants/urls';
import { Types } from 'mongoose';
import { User } from '../shared/models/userModel';
@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  // Modify to match backend response
  private reserveInfoSubject = new BehaviorSubject<ReserveMessage[]>([]);
  private landlordSubject = new BehaviorSubject<User[]>([]);

  public reserveInfo$ = this.reserveInfoSubject.asObservable();
  public landlord$ = this.landlordSubject.asObservable();

  constructor(private http: HttpClient) {}

  getReserveInfo(userid: Types.ObjectId|undefined): Observable<{reservation: ReserveMessage[], landlords: User[]}> {
    
    if (!userid) {
      return throwError(() => new Error('User ID is undefined'));
    }

    return this.http.post<{reservation: ReserveMessage[], landlords: User[]}>(
      RESERVEGET_URL, 
      { user_id: userid }
    ).pipe(
      tap((result) => {
        console.log(result);
        this.reserveInfoSubject.next(result.reservation);
        this.landlordSubject.next(result.landlords);
      }),
      catchError((error) => {
        console.error('Error fetching reserve info:', error);
        return throwError(() => error);
      })
    );
  }

  upload(query: ReserveMessage[]) {
    return this.http.post<ReserveMessage[]>(RESERVERUPLOAD_URL, query);
  }
}
