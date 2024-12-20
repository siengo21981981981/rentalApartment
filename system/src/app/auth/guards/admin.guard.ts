import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../services/user.service';

export class adminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.userService.currentUser.isadmin == true) {
      return true;
    }

    return false;
  }
}
