import { SwipeablePanelSnap } from '../constants';
import { Enum } from '../utilities';

export type SwipeablePanelSnapPosition = Enum<typeof SwipeablePanelSnap>;

export interface SwipeCoordinate {
  x: number;
  y: number;
}

export interface SwipeMovement {
  from: number;
  to: number;
}

/**
 * Event triggered when the panel is being swiped by user or being programatically
 * swipped by calling setPosition, snapToPosition or close method.
 */
export interface SwipeEvent {
  value: number | null;
  snapped: boolean;
}
