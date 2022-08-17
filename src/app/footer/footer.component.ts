import { Component, OnInit } from '@angular/core';
/**
 * Footer component. This component is responsible for handling everything
 * related to the footer.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  /**
   * Footer constructor. Because the footer is only HTML and styling,
   * there isn't a need for special constructing.
  */
  constructor() { }

  /**
   * An empty ngOnInit to satisfy the implementation constraint
   * on the component.
   */
  ngOnInit(): void { }
}
