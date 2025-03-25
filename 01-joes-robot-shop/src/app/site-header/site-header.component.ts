import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user.model';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})
export class SiteHeaderComponent implements OnInit {
  user: IUser | null = null;
  showSignOutMenu = false;

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    this.userSvc.getUser().subscribe({
      next: (u) => this.user = u
    })
  }

  toggleSignOutMenu() {
    this.showSignOutMenu = !this.showSignOutMenu;
  }

  signOut() {
    this.userSvc.signOut();
  }
}
