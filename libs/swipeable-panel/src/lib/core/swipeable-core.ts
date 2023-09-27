import {
  MOTION_OFFSET_BEFORE_SWIPE_CAN_START,
  SwipeablePanelSnap,
  SwipeablePanelSnapTreshold,
  WAIT_TIME_BEFORE_SWIPE_CAN_START,
} from '../constants';
import { isNil, notNil } from '../utilities';
import {
  SwipeCoordinate,
  SwipeMovement,
  SwipeablePanelSnapPosition,
} from './types';

export function getTouchCoordinate(event: TouchEvent): SwipeCoordinate {
  return {
    x: event.changedTouches[0].clientX,
    y: event.changedTouches[0].clientY,
  };
}

export function canUpdatePosition(
  position: SwipeablePanelSnapPosition | number,
) {
  return (
    position <= SwipeablePanelSnap.Bottom && position >= SwipeablePanelSnap.Top
  );
}

export function isSwipeActive(
  movement: SwipeMovement,
  swipeInitTime?: number,
): boolean {
  const currentTime = new Date().getTime();

  if (
    isNil(swipeInitTime) ||
    isNaN(swipeInitTime) ||
    !isFinite(swipeInitTime) ||
    swipeInitTime > currentTime
  )
    return false;

  const elapsedTimeInMs = currentTime - swipeInitTime;

  // measured in ms
  if (elapsedTimeInMs < WAIT_TIME_BEFORE_SWIPE_CAN_START) return false;

  // measured in %
  if (
    (Math.abs(movement.from - movement.to) / movement.from) * 100 <=
    MOTION_OFFSET_BEFORE_SWIPE_CAN_START
  )
    return false;

  return true;
}

export function validateSnapTresholds(treshold?: SwipeablePanelSnapTreshold) {
  if (isNil(treshold)) return;

  const { top, center, bottom } = treshold;

  if (
    notNil(top) &&
    notNil(center) &&
    top >= SwipeablePanelSnap.Center - center
  ) {
    throw new Error('Top and center treshold should not overlap.');
  }

  if (
    notNil(top) &&
    isNil(center) &&
    notNil(bottom) &&
    top >= SwipeablePanelSnap.Bottom - bottom
  ) {
    throw new Error('Top and bottom treshold should not overlap.');
  }

  if (
    isNil(top) &&
    notNil(center) &&
    notNil(bottom) &&
    SwipeablePanelSnap.Center + center > SwipeablePanelSnap.Bottom - bottom
  ) {
    throw new Error('Bottom and center treshold should not overlap.');
  }
}
