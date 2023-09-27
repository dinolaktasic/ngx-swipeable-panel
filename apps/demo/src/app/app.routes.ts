import { Route } from '@angular/router';
import { NgxSwipeablePanelDemoComponent } from './swipeable-panel-demo/swipeable-panel-demo.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'demo', pathMatch: 'full' },
  { path: 'demo', component: NgxSwipeablePanelDemoComponent },
  { path: '**', redirectTo: '' },
];
