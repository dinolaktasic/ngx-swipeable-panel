import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwipeablePanelDirective } from './swipeable-panel.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [SwipeablePanelDirective],
  exports: [SwipeablePanelDirective],
})
export class SwipeablePanelModule {}
