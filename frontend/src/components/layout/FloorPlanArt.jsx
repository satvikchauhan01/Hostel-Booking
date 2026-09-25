const COLS = 10;
const ROOM_W = 60;
const LEFT = 20;
const TOP_Y = 24;
const ROOM_H = 108;
const CORRIDOR_H = 92;
const BOTTOM_Y = TOP_Y + ROOM_H + CORRIDOR_H;
const WIDTH = LEFT * 2 + COLS * ROOM_W;
const HEIGHT = BOTTOM_Y + ROOM_H + 24;
/**
 * Decorative architectural plan of one floor: two wings of ten rooms facing a corridor.
 * Purely visual (aria-hidden) - it mirrors how the real room map is laid out.
 */
export function FloorPlanArt({ filled = [], mine, className, labelled = true }) {
  const rooms = Array.from({ length: COLS * 2 }, (_, i) => {
    const top = i < COLS;
    const col = i % COLS;
    return { i, top, x: LEFT + col * ROOM_W, y: top ? TOP_Y : BOTTOM_Y, col };
  });
  return (
    <svg className={`plan-art ${className ?? ''}`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" aria-hidden="true" focusable="false">
      {/* outer wall */}
      <rect
        className="plan-art__wall"
        x={LEFT - 6}
        y={TOP_Y - 6}
        width={COLS * ROOM_W + 12}
        height={HEIGHT - 2 * (TOP_Y - 6) - 12}
        rx="6"
      />

      {/* corridor */}
      <line
        className="plan-art__dash"
        x1={LEFT + 8}
        x2={LEFT + COLS * ROOM_W - 8}
        y1={TOP_Y + ROOM_H + CORRIDOR_H / 2}
        y2={TOP_Y + ROOM_H + CORRIDOR_H / 2}
      />

      {rooms.map((room) => {
        const isMine = mine === room.i;
        const isFilled = filled.includes(room.i);
        const doorY = room.top ? room.y + ROOM_H : room.y;
        const dir = room.top ? -1 : 1;
        return (
          <g key={room.i}>
            <rect
              className={`plan-art__room ${isFilled ? 'is-filled' : ''} ${isMine ? 'is-mine' : ''}`}
              x={room.x}
              y={room.y}
              width={ROOM_W}
              height={ROOM_H}
            />
            {/* door: leaf + swing arc */}
            <path
              className="plan-art__door"
              d={`M ${room.x + 10} ${doorY} v ${dir * 18} M ${room.x + 10} ${doorY + dir * 18} A 18 18 0 0 ${room.top ? 1 : 0} ${room.x + 28} ${doorY}`}
            />
            {labelled && (
              <text
                className="plan-art__label"
                x={room.x + ROOM_W / 2}
                y={room.top ? room.y + 26 : room.y + ROOM_H - 16}
                textAnchor="middle"
              >
                {String(room.col + 1 + (room.top ? 0 : COLS)).padStart(2, '0')}
              </text>
            )}
          </g>
        );
      })}

      {/* stair blocks at the corridor ends */}
      <rect className="plan-art__stairs" x={LEFT + COLS * ROOM_W - 30} y={TOP_Y + ROOM_H + 14} width="22" height={CORRIDOR_H - 28} />
      <rect className="plan-art__stairs" x={LEFT + 8} y={TOP_Y + ROOM_H + 14} width="22" height={CORRIDOR_H - 28} />
    </svg>
  );
}
