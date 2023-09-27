import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NgxSwipeablePanelDemoComponent } from './swipeable-panel-demo/swipeable-panel-demo.component';
import { SwipeablePanelModule } from 'libs/swipeable-panel/src';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, NgxSwipeablePanelDemoComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    SwipeablePanelModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
