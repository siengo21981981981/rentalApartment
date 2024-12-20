import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterPreloader,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../services/user.service';
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private UserService: UserService) {}

   canActivate(
    state: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean {
    if (this.UserService.currentUser.token) {
      return true;
    }

    this.router.navigate(['/login']);
    window.alert('請先登入');
    return false;
  }
}