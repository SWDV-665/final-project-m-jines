import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  title = "BJJ Journal"
  welcome = "Welcome to"
  introp1 = 'App introduction, explanation, and goals. Aenean sed tellus nec mauris auctor dignissim fermentum in risus. Sed nec convallis sapien, id tincidunt enim. Mauris ornare eleifend nunc id mattis. Fusce augue diam, sagittis nec posuere at, consectetur tempor lectus. Nulla at lectus eget mauris iaculis malesuada mollis sed neque. Curabitur et risus tristique, malesuada mauris finibus, elementum massa. Proin lacinia mauris quis ligula blandit ullamcorper. Donec ut posuere lorem. In volutpat magna vitae tellus posuere pulvinar. Nam varius ligula justo, ne placerat lacus pharetra ac. Aenean massa orci, tristique in nisl ut, aliquet consectetur libero. Etiam luctus placerat vulputate. Aliquam ipsum massa, porttitor at mollis ut, pretium sit amet mi. In neque mauris, placerat et neque vel, tempor interdum dolor. Suspendisse gravida malesuada tellus, vel dapibus nisl dignissim vel. Cras ut nulla sit amet erat malesuada euismod vel a nulla.'
  introp2 = "Phasellus sit amet iaculis odio, eget feugiat erat. Etiam sit amet turpis sit amet massa viverra maximus. Aenean venenatis porttitor pharetra. Fusce vulputate urna purus, vel efficitur mauris auctor non. Etiam libero odio, sodales in velit a, faucibus venenatis erat. Ut convallis sit amet urna in ultrices. Cras neque est, vehicula sed lorem ac, placerat commodo elit. Praesent turpis metus, elementum eget iaculis ac, elementum in odio. Nunc et elit faucibus, condimentum mauris consequat, ornare dolor. Sed ac lectus a est blandit tempor. Etiam lobortis tristique maximus."
  constructor() {}

}
