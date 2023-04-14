import { Component, OnInit } from '@angular/core'

/**
 * The index component. This component is responsible for showing everything on the
 * main landing page.
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  /**
   * This component only contains markup and styling, hence an
   * empty constructor.
   */
  constructor() {}

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void {}
}
