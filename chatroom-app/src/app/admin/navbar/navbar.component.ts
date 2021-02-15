import { Component, Input } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'admin-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  toggleSidenav: boolean = false;
  toggleNavbar: boolean = false;
  minimizeSidenav: boolean = false;
  dropdownNavbar: boolean = false;
  username: string;
  isDark: boolean = false;



  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute)
  {
    this.username = this.activatedRoute.snapshot.params.username;
  }

  ngOnInit(): void {
    // Get theme from localstorage and display the webpage accordingly.
    let theme = localStorage.getItem('theme');
    document.body.setAttribute('data-theme', theme || "light");
    this.isDark = theme === 'dark' ? true : false;

    this.breakpointObserver.observe([
      '(max-width: 867px)',
      '(max-width: 409px)'
    ]).subscribe( (state: BreakpointState) => {
      this.minimizeSidenav = state.breakpoints['(max-width: 867px)'];
      this.dropdownNavbar = state.breakpoints['(max-width: 409px)'];


      /* 
        If the width of the screen is below 867px, Minimize the sidenav into a menu button, else display sidenav as block and 
        set toggleSidenav to false as the variable is used to toggle the sidenav button. 
      */
      let sidenav = <HTMLElement>document.getElementById('sidenav');
      let sidenavList = <HTMLElement>document.getElementById('sidenav-list');
      if (this.minimizeSidenav === true) {
        sidenavList.style.display = "none";
        sidenav.style.position = "";
        sidenav.style.width = "0px";
      } else {
        this.toggleSidenav = false;
        sidenavList.style.display = "block";
        sidenav.style.position = ""; 
        sidenav.style.width = "250px";
      }

    });
  }

  toggleTheme() {
    // Toggle between light theme and dark theme and store the theme in localstorage
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.setAttribute('data-theme', "dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', "light");
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSidenavHandler() {
    let sidenav = <HTMLElement>document.getElementById('sidenav');
    let sidenavList = <HTMLElement>document.getElementById('sidenav-list');
    this.toggleSidenav = !this.toggleSidenav;
    if (this.toggleSidenav === false) {
      sidenavList.style.display = "none";
      sidenav.style.width = "0px";
      setTimeout(() => { sidenav.style.position = "";}, 500)
    } else {
      sidenavList.style.display = "block";
      sidenav.style.position = "absolute";
      sidenav.style.width = "250px";
    }
  }

  toggleNavbarHandler() {
    this.toggleNavbar = !this.toggleNavbar;
    // Toggle Collapse of Navbar links
    let navbarList = <HTMLElement>document.getElementById('dropdown-links');
    if (navbarList.style.maxHeight) {
      navbarList.style.maxHeight = "";
    } else {
      navbarList.style.maxHeight = navbarList.scrollHeight + "px";
    }
  }

  

  onLogout(){
    this.router.navigate(['/']);
  }
}
