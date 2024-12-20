import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  LOGIN_URL,
  REGISTER_URL,
  GETALLUSER_URL,
  UPDATEUSER_URL,
  UPDATEROOM_URL,
  RESERVEUSER_URL,
} from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/userModel';
import { Types } from 'mongoose';
import { Router } from '@angular/router';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private userSubject = new BehaviorSubject<User>(//BehaviorSubject is a type of Observable for managing last value
    this.getUserFromLocalStorage()
  );
  public userObservable$: Observable<User>;
  public isLogin = false;
  constructor(private http: HttpClient, private router: Router) {
    this.userObservable$ = this.userSubject.asObservable();
  }
  public get currentUser(): User {
    return this.userSubject.value;
  }
  login(userLogin: IUserLogin): Observable<User> {
    console.log('logining');
    return this.http.post<User>(LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          console.log(user);
          this.setUserFromLocalStorage(user);
          this.userSubject.next(user);
          this.isLogin = true
        },
      })
    );
  }
  refreshUser(): Observable<User> {
    const body = { id: this.currentUser._id };
    
    return this.http.post<User>(RESERVEUSER_URL, body).pipe(
      tap({
        next: (user) => {
          this.setUserFromLocalStorage(user);
          this.userSubject.next(user);
        },
      })
    );
  }
  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserFromLocalStorage(user);
          this.userSubject.next(user);
        },
      })
    );
  }
  updatePersonInfo(user: User): Observable<User> {
    return this.http.post<User>(UPDATEUSER_URL, user).pipe(
      tap({
        next: (user) => {
          this.setUserFromLocalStorage(user);
          this.userSubject.next(user);
        },
      })
    );
  }
  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(GETALLUSER_URL);
  }
  update(user: {
    id: any;
    password?: string;
    email?: string;
    phone?: string;
    username?: string;
    name?: string;
    birthday?: string;
    token?: string;
    isLandlord?: boolean;
    isadmin?: boolean;
    properties?: { _id: any; title: string; img_link: any }[];
  }): Observable<User> {
    return this.http.post<User>(UPDATEUSER_URL, user);
  }

  updateRoom(
    userId: any,
    properties: { _id: Types.ObjectId; title: string; img_link: any }[]
  ): Observable<User> {
    
    try {
      if(!(userId == null) || !(properties == null)) {
        return this.http.post<User>(UPDATEROOM_URL, { id:userId, properties });
      };
    } catch (error) {
      console.log(error);
    }
    return this.http.post<User>(UPDATEROOM_URL, { userId, properties });
    
  }
  logout() {
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(new User());
    window.location.reload();
    this.isLogin = false;
    this.router.navigate(['login']);
  }
  setUserFromLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? (JSON.parse(userJson) as User) : new User();
  }
}
