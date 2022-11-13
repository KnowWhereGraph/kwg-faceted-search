import { Component, OnInit } from '@angular/core';

/**
 * Component for the navigation bar. This component encompasses the navigation
 * bar.
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  /**
   * An empty constructor; this class is just markup and styling.
   */
  constructor() { }

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void {
  }
}
