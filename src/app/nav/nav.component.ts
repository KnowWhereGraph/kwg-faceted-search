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
<<<<<<< HEAD
  ngOnInit(): void {
  }


  /**
   * An event handler that gets triggered when the tab changes
   *
   * @param tabChangeEvent The event for the tab change
   */
   onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    let clickedIndex = tabChangeEvent.index;
  }
=======
  ngOnInit(): void { }
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
}
