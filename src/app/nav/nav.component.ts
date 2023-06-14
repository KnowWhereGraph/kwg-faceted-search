import { Component, OnInit } from '@angular/core'
import { NavInfoService } from '../services/nav.service'
import { Subscription } from 'rxjs/internal/Subscription'

/**
 * Component for the navigation bar. This component encompasses the navigation
 * bar.
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  breadcrumb: string = ''
  pageName: string = ''
  navChangedSub: Subscription

  /**
   * Creates a new nav component.
   *
   * @param navInfoService: Service with a stream that contains new data to display in the nav area
   */
  constructor(private navInfoService: NavInfoService) {
    this.navChangedSub = navInfoService.onNavChanged.subscribe((event) => {
      this.onNavigationChange(event)
    })
  }

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void {}

  /**
   * Triggered when a page changes in a way that requires the navigation
   * display to be updated. The new relative path and full path should be
   * included in the fired event.
   *
   * @param event The navigation change event, carrying the new state information
   */
  onNavigationChange(event: NavEvent) {
    this.breadcrumb = event.fullPath
    this.pageName = event.relativePath
  }
}

/**
 * Template for a new navigation state
 */
export interface NavEvent {
  relativePath: string
  fullPath: string
}
