import { useRef } from 'react';
import { cx } from '../../utils/cx';

/** Radio-group semantics: one tab stop, arrow keys move between floors. */
export function FloorSelector({ floors, value, onChange, statsByFloor, overall }) {
  const options = ['all', ...floors];
  const refs = useRef(new Map());
  const onKeyDown = (event) => {
    const index = options.indexOf(value);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    onChange(options[next]);
    refs.current.get(options[next])?.focus();
  };
  return (
    <div className="floors" role="radiogroup" aria-label="Floor" onKeyDown={onKeyDown}>
      {options.map((option) => {
        const active = option === value;
        const free = option === 'all' ? overall.available : (statsByFloor[option]?.available ?? 0);
        return (
          <button
            key={option}
            ref={(el) => {
              if (el) refs.current.set(option, el);
              else refs.current.delete(option);
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={cx('floor-key', active && 'is-active')}
            onClick={() => onChange(option)}
            aria-label={option === 'all' ? `All floors, ${free} available` : `Floor ${option}, ${free} available`}
          >
            <span className="floor-key__name">{option === 'all' ? 'All' : option}</span>
            <span className="floor-key__meta num">{option === 'all' ? 'floors' : `${free} free`}</span>
          </button>
        );
      })}
    </div>
  );
}
