import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The header component. This component is responsible for representing the header
 * that is present on every page.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Creates a new header.
   *
   * @param router The Angular router, which is used to display the page name
   */
  constructor(public router: Router) { }

  /**
   * Empty ngOnInit to satisfy the header's constrains from OnInit.
   */
  ngOnInit(): void { }
}
