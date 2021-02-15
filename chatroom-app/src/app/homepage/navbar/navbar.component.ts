import { Component, Input } from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'homepage-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  toggleNavbar: boolean = false;
  dropdownNavbar: boolean = false;
  isDark: boolean = false;



  constructor(
    public router: Router,
    private breakpointObserver: BreakpointObserver,
  ) { }
  
  

  ngOnInit(): void {
    // Get theme from localstorage and display the webpage accordingly.
    let theme = localStorage.getItem('theme');
    document.body.setAttribute('data-theme', theme || "light");
    this.isDark = theme === 'dark' ? true : false;

    // Observer breakpoints to display the webpage responsively.
    this.breakpointObserver.observe([
      '(max-width: 409px)'
    ]).subscribe((state: BreakpointState) => {
      // If width of screen goes below 409px, Make navbar links into a dropdown.
      this.dropdownNavbar = state.breakpoints['(max-width: 409px)'];
    });
  }

  toggleTheme = (): void => {
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

  toggleNavbarHandler() {
    this.toggleNavbar = !this.toggleNavbar;
    // Toggle Collapse of Navbar links
    let navbarList = <HTMLElement>document.getElementById('dropdown-links');
    if (navbarList.style.maxHeight) {
      navbarList.style.maxHeight = "0px";
    } else {
      navbarList.style.maxHeight = navbarList.scrollHeight + "px";
    }
  }
}
