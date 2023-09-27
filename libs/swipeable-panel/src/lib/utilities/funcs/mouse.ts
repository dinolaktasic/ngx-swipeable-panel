export function isLeftMouseDown(event: MouseEvent): boolean {
  // 1: Primary button (usually the left button)
  return event.buttons === 1;
}

// This will fail if there's any kind of rotation going on.
export function isMouseWithinElement(event: MouseEvent, element: HTMLElement) {
  const offset = element.getBoundingClientRect();
  return event.clientX - offset.x >= 0 && event.clientY - offset.y >= 0;
}
