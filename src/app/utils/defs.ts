export const ALL_MOVEMENTS = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
type MovementTuple = typeof ALL_MOVEMENTS;
export type Movement = MovementTuple[number];

export const KEYCODE_MOVEMENTS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
export type KeyCodeMovement = (typeof KEYCODE_MOVEMENTS)[number];
