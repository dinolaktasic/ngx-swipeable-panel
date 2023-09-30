import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  SWIPEABLE_PANEL_STYLE,
  SwipeablePanelSnap,
  SwipeablePanelSnapTreshold,
} from './constants';
import { SwipeEvent } from './core/types';
import {
  canUpdatePosition,
  getTouchCoordinate,
  isSwipeActive,
  validateSnapTresholds,
} from './core/swipeable-core';
import { isLeftMouseDown, isMouseWithinElement } from './utilities/funcs/mouse';
import { isNil, notNil } from './utilities';

@Directive({
  selector: '[ngxSwipeablePanel]',
})
export class SwipeablePanelDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private zone = inject(NgZone);
  private startPosition?: number;
  private currentPosition = 0;
  private swipeInitTime?: number;
  private _enabled = true;
  private _closed = false;
  private _treshold?: SwipeablePanelSnapTreshold;
  private observer: ResizeObserver;

  get isClosed() {
    return this._closed;
  }

  get swipeablePanel(): HTMLDivElement {
    return this.elementRef.nativeElement;
  }

  get swipeablePanelParentHeight(): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    return this.swipeablePanel.offsetParent?.clientHeight!;
  }

  get currentPositionPercentage(): number {
    return (
      100 -
      Math.round(
        ((this.swipeablePanelParentHeight - this.currentPosition) /
          this.swipeablePanelParentHeight) *
          100,
      )
    );
  }

  @Input()
  set snapTreshold(treshold: SwipeablePanelSnapTreshold | undefined) {
    this._treshold = treshold;
    validateSnapTresholds(this._treshold);
  }
  get snapTreshold(): SwipeablePanelSnapTreshold | undefined {
    return this._treshold;
  }

  @Input()
  swipeHeightWhenClosed = 0;

  @Input() style = '';

  @Input({
    alias: 'ngxSwipeablePanel',
    required: true,
  })
  set enabled(value: BooleanInput) {
    this._enabled = coerceBooleanProperty(value);

    if (!this._enabled) {
      this.position = null;
    }
  }
  get enabled(): boolean {
    return this._enabled;
  }

  @HostBinding('style.transition')
  @Input()
  cssTransition: string = 'top 500ms ease 0s';

  @Output() swipeStart = new EventEmitter();
  @Output() swipping = new EventEmitter();
  @Output() swipeEnd = new EventEmitter();
  @Output() positionChange = new EventEmitter<SwipeEvent>();

  @HostBinding('style')
  get styles(): string {
    return [this.style, this.enabled ? SWIPEABLE_PANEL_STYLE : ''].join(' ');
  }

  @HostBinding('style.top.%')
  position: number | null = SwipeablePanelSnap.Center;

  get canSnapToTop() {
    return (
      this.position !== SwipeablePanelSnap.Top &&
      this.currentPositionPercentage <=
        SwipeablePanelSnap.Top + (this.snapTreshold?.top ?? 0)
    );
  }

  get canSnapToCenter() {
    return (
      this.position !== SwipeablePanelSnap.Center &&
      this.currentPositionPercentage >=
        SwipeablePanelSnap.Center - (this.snapTreshold?.center ?? 0) &&
      this.currentPositionPercentage <=
        SwipeablePanelSnap.Center + (this.snapTreshold?.center ?? 0)
    );
  }

  get canSnapToBottom() {
    const bottomWithOffset =
      SwipeablePanelSnap.Bottom - (this.snapTreshold?.bottom ?? 0);
    return (
      (this.position !== SwipeablePanelSnap.Bottom &&
        bottomWithOffset === SwipeablePanelSnap.Bottom) ||
      this.position === bottomWithOffset ||
      this.currentPositionPercentage >= bottomWithOffset
    );
  }

  get canUpdatePosition() {
    return canUpdatePosition(this.currentPositionPercentage);
  }

  ngOnInit(): void {
    this.adjustPositionOnResize();
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.swipeablePanel);
  }

  @HostListener('document:mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    if (
      this.enabled &&
      isLeftMouseDown(event) &&
      isMouseWithinElement(event, this.swipeablePanel)
    ) {
      this.startPosition = event.clientY;
      this.swipeInitTime = new Date().getTime();
      this.swipeStart.emit();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    event.preventDefault();

    const currentPosition = event.clientY;
    if (
      !this.canSwipeByTouchOrMouse(currentPosition) ||
      !isLeftMouseDown(event)
    )
      return;

    this.setPosition(currentPosition);
    this.swipping.emit();
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    const currentPosition = event.clientY;
    if (!this.canSwipeByTouchOrMouse(currentPosition)) {
      this.deactivateSwipe();
      return;
    }

    this.snapToPosition(currentPosition);
    this.swipeEnd.emit();
  }

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    if (!this.enabled) return;

    this.startPosition = getTouchCoordinate(event).y;
    this.swipeInitTime = new Date().getTime();
    this.swipeStart.emit();
  }

  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent) {
    event.preventDefault();

    const currentPosition = getTouchCoordinate(event).y;
    if (!this.canSwipeByTouchOrMouse(currentPosition)) return;

    this.setPosition(currentPosition);
    this.swipping.emit();
  }

  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent) {
    const currentPosition = getTouchCoordinate(event).y;
    if (!this.canSwipeByTouchOrMouse(currentPosition)) return;

    this.snapToPosition(currentPosition);
    this.swipeEnd.emit();
  }

  close(): void {
    if (!this.enabled) return;

    this.currentPosition =
      this.swipeablePanelParentHeight - this.swipeHeightWhenClosed;
    this.position = this.getClosedPosition();
    this._closed = true;
    this.positionChange.emit({ value: this.position, snapped: false });
  }

  setPosition(value: number): void {
    if (!this.enabled) return;

    this.currentPosition = value;

    if (!this.canUpdatePosition) return;

    this.position = this.currentPositionPercentage;
    this._closed = this.position >= this.getClosedPosition();

    this.positionChange.emit({ value: this.position, snapped: false });
  }

  snapToPosition(value: number): void {
    if (!this.enabled) return;

    this.currentPosition = value;
    const previousPosition = this.position;

    if (this.canSnapToTop) {
      this.position = SwipeablePanelSnap.Top;
      this._closed = false;
    } else if (this.canSnapToCenter) {
      this.position = SwipeablePanelSnap.Center;
      this._closed = false;
    } else if (this.canSnapToBottom) {
      this.position = this.getClosedPosition();
      this._closed = true;
    }

    this.deactivateSwipe();

    if (this.position !== previousPosition) {
      this.positionChange.emit({ value: this.position, snapped: true });
    }
  }

  private canSwipeByTouchOrMouse(currentPosition: number): boolean {
    return (
      this.enabled &&
      notNil(this.startPosition) &&
      isSwipeActive(
        { from: this.startPosition, to: currentPosition },
        this.swipeInitTime,
      )
    );
  }

  private deactivateSwipe(): void {
    this.startPosition = undefined;
    this.swipeInitTime = undefined;
  }

  private getClosedPosition(): number {
    return this.swipeablePanelParentHeight === 0
      ? SwipeablePanelSnap.Bottom
      : Math.round(
          SwipeablePanelSnap.Bottom -
            (this.swipeHeightWhenClosed / this.swipeablePanelParentHeight) *
              100,
        );
  }

  private adjustPositionOnResize(): void {
    this.observer = new ResizeObserver((entries) => {
      const entry = notNil(entries) && entries[0];
      if (isNil(entry)) return;
      this.zone.run(() => {
        const currentBottomOffset = this.getClosedPosition();
        const tresholdBottomOffset = this.snapTreshold?.bottom ?? 0;
        if (this.isClosed && currentBottomOffset >= tresholdBottomOffset) {
          this.position = this.getClosedPosition();
        }
      });
    });

    this.observer.observe(this.swipeablePanel);
  }
}
