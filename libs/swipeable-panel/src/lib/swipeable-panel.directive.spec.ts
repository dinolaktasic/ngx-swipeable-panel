import { Component, ViewChild } from '@angular/core';
import { SwipeablePanelDirective } from './swipeable-panel.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipeablePanelSnap } from './constants';
import { SwipeablePanelSnapPosition } from './core';

@Component({
  selector: 'host',
  template: `
    <div class="container">
      <div class="swipeable" style="color: gray" ngxSwipeablePanel>Test</div>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100vh;
        position: relative;
      }
    `,
  ],
})
class SwipeablePanelHost {
  @ViewChild(SwipeablePanelDirective, { static: true })
  swipeablePanel: SwipeablePanelDirective;
}

describe('SwipeablePanelDirective', () => {
  let directive: SwipeablePanelDirective;
  let component: SwipeablePanelHost;
  let fixture: ComponentFixture<SwipeablePanelHost>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SwipeablePanelDirective, SwipeablePanelHost],
    }).createComponent(SwipeablePanelHost);

    fixture.detectChanges();
    component = fixture.componentInstance;
    directive = component.swipeablePanel;
  });

  test('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should have defaults', () => {
    expect(directive.isClosed).toEqual(false);
    expect(directive.position).toEqual(50);
    expect(directive.cssTransition).toEqual('top 500ms ease 0s');
    expect(directive.swipeHeightWhenClosed).toEqual(0);
    expect(directive.snapTreshold).toBeUndefined();
    expect(directive.enabled).toBe(true);
  });

  test('should append host element style to style list if set', () => {
    expect(directive.style).toBe('color: gray;');
  });

  test('should throw when assigning invalid snap treshold', () => {
    expect(
      () => (directive.snapTreshold = { top: 25, center: 25, bottom: 25 }),
    ).toThrowError('Top and center treshold should not overlap.');

    expect(
      () => (directive.snapTreshold = { top: 25, center: 25 }),
    ).toThrowError('Top and center treshold should not overlap.');

    expect(
      () => (directive.snapTreshold = { top: 50, bottom: 50 }),
    ).toThrowError('Top and bottom treshold should not overlap.');

    expect(
      () => (directive.snapTreshold = { center: 50, bottom: 50 }),
    ).toThrowError('Bottom and center treshold should not overlap.');
  });

  test('close should set position to bottom and isClosed to true when property swipeHeightWhenClosed is not set', () => {
    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    expect(directive.isClosed).toEqual(false);
    directive.close();
    expect(directive.position).toEqual(SwipeablePanelSnap.Bottom);
    expect(directive.isClosed).toEqual(true);
  });

  test('close should set position to value of swipeHeightWhenClosed property and isClosed to true', () => {
    directive.swipeHeightWhenClosed = 30;

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    expect(directive.isClosed).toEqual(false);
    directive.close();
    expect(directive.position).toEqual(SwipeablePanelSnap.Bottom - 30);
    expect(directive.isClosed).toEqual(true);
  });

  test('should set isClosed to true when position is set to bottom', () => {
    expect(directive.isClosed).toEqual(false);

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => SwipeablePanelSnap.Bottom);

    directive.setPosition(SwipeablePanelSnap.Bottom);
    expect(directive.isClosed).toEqual(true);
  });

  test('should set isClosed to true when position is snapped to bottom', () => {
    expect(directive.isClosed).toEqual(false);

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => SwipeablePanelSnap.Bottom);

    directive.snapToPosition(SwipeablePanelSnap.Bottom);
    expect(directive.isClosed).toEqual(true);
  });

  test('should set isClosed to true when position overlaps bottom offseted by value of swipeHeightWhenClosed property', () => {
    expect(directive.isClosed).toEqual(false);

    directive.swipeHeightWhenClosed = 30;

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 70);

    directive.setPosition(70);
    expect(directive.isClosed).toEqual(true);
  });

  test('should set isClosed to false when position is set or snapped to non closed position', () => {
    expect(directive.isClosed).toEqual(false);

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    const setCurrentPositionPercentage = (
      value: number | SwipeablePanelSnapPosition,
    ) =>
      jest
        .spyOn(directive, 'getCurrentPositionPercentage')
        .mockImplementation(() => value);

    directive.snapTreshold = { top: 25, center: 24, bottom: 25 };

    const close = (value: number, callback: (value: number) => void) => {
      directive.close();
      expect(directive.isClosed).toEqual(true);
      setCurrentPositionPercentage(value);
      callback(value);
    };

    const setPosition = (value: number) => {
      directive.setPosition(value);
      expect(directive.isClosed).toEqual(false);
    };

    const snapToPosition = (value: number) => {
      directive.snapToPosition(value);
      expect(directive.isClosed).toEqual(false);
    };

    close(SwipeablePanelSnap.Top, setPosition);
    close(SwipeablePanelSnap.Center, setPosition);
    close(25, setPosition);

    close(SwipeablePanelSnap.Top, snapToPosition);
    close(SwipeablePanelSnap.Center, snapToPosition);
    close(25, snapToPosition);

    directive.swipeHeightWhenClosed = 30;

    close(69, setPosition);
    close(69, snapToPosition);
  });

  test('should set position', () => {
    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 0);

    directive.setPosition(0);
    expect(directive.position).toBe(0);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 75);

    directive.setPosition(75);
    expect(directive.position).toBe(75);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 100);

    directive.setPosition(100);
    expect(directive.position).toBe(100);
  });

  test('should not set position', () => {
    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => -1);
    directive.setPosition(75);
    expect(directive.position).not.toEqual(75);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 101);
    directive.setPosition(75);
    expect(directive.position).not.toEqual(75);
  });

  test('should snap to top', () => {
    directive.snapTreshold = { top: 25 };

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 25);

    expect(directive.canSnapToTop).toBe(true);
    directive.snapToPosition(25);

    expect(directive.canSnapToTop).toBe(false);
    expect(directive.position).toBe(SwipeablePanelSnap.Top);
  });

  test('should snap to center', () => {
    directive.snapTreshold = { center: 25 };
    directive.position = 25;

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 25);

    expect(directive.canSnapToCenter).toBe(true);

    directive.snapToPosition(25);

    expect(directive.canSnapToCenter).toBe(false);
    expect(directive.position).toBe(SwipeablePanelSnap.Center);

    directive.position = 75;

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 75);

    directive.snapToPosition(75);

    expect(directive.position).toBe(SwipeablePanelSnap.Center);
  });

  test('should snap to bottom', () => {
    directive.snapTreshold = { bottom: 25 };
    directive.position = 75;

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 75);

    expect(directive.canSnapToBottom).toBe(true);
    directive.snapToPosition(75);

    expect(directive.position).toBe(SwipeablePanelSnap.Bottom);
  });

  test('should snap to correct position', () => {
    directive.snapTreshold = { top: 25, center: 24, bottom: 25 };

    jest
      .spyOn(directive, 'swipeablePanelParentHeight', 'get')
      .mockImplementation(() => 100);

    // snap to top
    directive.position = 25;
    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 25);

    expect(directive.canSnapToTop).toBe(true);
    expect(directive.canSnapToCenter).toBe(false);
    expect(directive.canSnapToBottom).toBe(false);
    directive.snapToPosition(25);

    expect(directive.position).toEqual(SwipeablePanelSnap.Top);
    expect(directive.position).not.toEqual(SwipeablePanelSnap.Center);
    expect(directive.position).not.toEqual(SwipeablePanelSnap.Bottom);

    // snap to center (upper part)
    directive.position = 26;
    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 26);

    expect(directive.canSnapToTop).toBe(false);
    expect(directive.canSnapToCenter).toBe(true);
    expect(directive.canSnapToBottom).toBe(false);
    directive.snapToPosition(26);

    expect(directive.position).not.toEqual(SwipeablePanelSnap.Top);
    expect(directive.position).toEqual(SwipeablePanelSnap.Center);
    expect(directive.position).not.toEqual(SwipeablePanelSnap.Bottom);

    // snap to center (lower part)
    directive.position = 74;
    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 74);

    expect(directive.canSnapToTop).toBe(false);
    expect(directive.canSnapToCenter).toBe(true);
    expect(directive.canSnapToBottom).toBe(false);
    directive.snapToPosition(74);

    expect(directive.position).not.toEqual(SwipeablePanelSnap.Top);
    expect(directive.position).toEqual(SwipeablePanelSnap.Center);
    expect(directive.position).not.toEqual(SwipeablePanelSnap.Bottom);

    // snap to bottom
    directive.position = 75;
    jest
      .spyOn(directive, 'getCurrentPositionPercentage')
      .mockImplementation(() => 75);

    expect(directive.canSnapToTop).toBe(false);
    expect(directive.canSnapToCenter).toBe(false);
    expect(directive.canSnapToBottom).toBe(true);
    directive.snapToPosition(75);

    expect(directive.position).not.toEqual(SwipeablePanelSnap.Top);
    expect(directive.position).not.toEqual(SwipeablePanelSnap.Center);
    expect(directive.position).toEqual(SwipeablePanelSnap.Bottom);
  });
});
