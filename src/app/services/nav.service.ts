import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/internal/Subject'

/**
 * Service for passing navigation page information from components to
 * the navigation component. This is required because the navigation component
 * lives in the app root, while other components are rendered conditionally through
 * the router which makes it difficult to pass data to the parent app root.
 */
@Injectable({
  providedIn: 'root',
})
export class NavInfoService {
  // Event stream that holds new nav state
  onNavChanged = new Subject<any>()

  constructor() {}
}
