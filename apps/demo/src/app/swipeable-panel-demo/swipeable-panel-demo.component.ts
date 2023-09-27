import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  SwipeablePanelDirective,
  SwipeablePanelSnap,
} from '@ngx/swipeable-panel';

@Component({
  selector: 'app-nx-swipeable-panel-demo',
  templateUrl: './swipeable-panel-demo.component.html',
  styleUrls: ['./swipeable-panel-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NgxSwipeablePanelDemoComponent {
  readonly top = SwipeablePanelSnap.Top;

  @ViewChild(SwipeablePanelDirective) swipeablePanel?: SwipeablePanelDirective;

  readonly todos = [
    'Morning exercise',
    'Have breakfast',
    'Attend daily meeting',
    'Resolve some tickets',
    'Have lunch',
    'Buy groceries',
    'Have dinner',
    'Read a book',
  ];

  todoControl = new FormControl<string>(
    { value: '', disabled: false },
    {
      nonNullable: true,
      validators: Validators.required,
    },
  );

  addTodo(): void {
    if (!this.todoControl.valid) return;

    this.todos.push(this.todoControl.value);
    this.todoControl.reset();
  }

  close(): void {
    this.swipeablePanel?.close();
  }
}
