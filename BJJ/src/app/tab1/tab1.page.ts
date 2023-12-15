import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  title = "BJJ Journal"
  welcome = "Welcome to"
  introp1 = "The online platform created specifically for Brazilian Jiu Jitsu enthusiasts. Whether you're a seasoned practitioner, a dedicated coach, or simply someone looking to dive into the world of BJJ, we're here to support your journey. At BJJ Journal, we understand the importance of keeping track of your training progress. That's why we've developed an intuitive training log feature that allows you to record and organize your training sessions effortlessly. From drilling techniques to live sparring, you can document every step of your training and gain valuable insights into your development over time. But that's not all—our platform also provides a dedicated technique library where you can build your own collection of BJJ techniques. Whether it's a fundamental sweep, a sneaky submission, or a complex transition, you can store and categorize your favorite techniques in one place. With the ability to add detailed descriptions and even attach videos, you'll have a handy resource to refer to whenever you need it."
  constructor() {}

}
