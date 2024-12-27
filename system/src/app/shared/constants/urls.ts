import { environment } from "../../../envirments/environment";


export const BASE_URL = environment.BASE_URL;
// roomInfo
export const ROOMINFO_URL = BASE_URL + '/roomInfo/';
export const ROOMINFOGET_URL = BASE_URL + '/roomInfo/get';
export const ROOMINFOFIND_URL = BASE_URL + '/roomInfo/find'; //ROOMINFOFIND_URL
export const UPLOADIMG_URL = BASE_URL + '/roomInfo/uploadImg';
export const UPLOAD_URL = BASE_URL + '/roomInfo/upload';
export const ROOMINFORESULT_URL = BASE_URL + '/roomInfo/result';
export const DELETEDELIVER_URL = BASE_URL + '/deliverInfo/deleteDeliver';
// user
export const LOGIN_URL = BASE_URL + '/user/login/';
export const REGISTER_URL = BASE_URL + '/user/register/';
export const GETALLUSER_URL = BASE_URL +'/user/getAllUser'
export const UPDATEUSER_URL = BASE_URL +'/user/updateUser'
export const UPDATEROOM_URL = BASE_URL + '/user/updateRoom' 
export const RESERVEUSER_URL = BASE_URL + '/user/refresh'
// reserve
export const RESERVE_URL = BASE_URL + '/reserve/';
export const RESERVEGET_URL = BASE_URL + '/reserve/getReserve';
export const RESERVERUPLOAD_URL = BASE_URL + '/reserve/upload';
export const RESERVEUPDATE_URL = BASE_URL + '/reserve/update';
export const RESERVEDELETE_URL = BASE_URL + '/reserve/delete';
