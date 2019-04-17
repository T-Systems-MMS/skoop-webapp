import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { TestimonialsNewComponent } from './testimonials-new.component';
import { Testimonial } from './testimonial';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  constructor(private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  openNewDialog() {
    this.bottomSheet.open(TestimonialsNewComponent)
      .afterDismissed().subscribe((testimonial: Testimonial) => {
      if (testimonial) {

      }
    });
  }

}
