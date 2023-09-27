/** Snap positions represented in [%] */
export const SwipeablePanelSnap = {
  Top: 0,
  Center: 50,
  Bottom: 100,
};

/** Snap treshold represented in [%] */
export type SwipeablePanelSnapTreshold = {
  top?: number;
  center?: number;
  bottom?: number;
};

/** Wait time before swipping can start in [ms] */
export const WAIT_TIME_BEFORE_SWIPE_CAN_START = 250;

/** Motion offset before swipping can start in [%] */
export const MOTION_OFFSET_BEFORE_SWIPE_CAN_START = 1;

export const SWIPEABLE_PANEL_STYLE = `
          z-index: 1000;
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: auto;
        `;
