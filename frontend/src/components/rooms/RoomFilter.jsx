import { Search, X } from 'lucide-react';
import { cx } from '../../utils/cx';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'booked', label: 'Booked' },
];
export function RoomFilter({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="filter">
      <div className="filter__search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search room number"
          aria-label="Search rooms by number"
          inputMode="numeric"
          autoComplete="off"
        />
        {query && (
          <button type="button" className="filter__clear" onClick={() => onQueryChange('')} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      <div className="segmented" role="radiogroup" aria-label="Filter by status">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={status === option.value}
            className={cx('segmented__item', status === option.value && 'is-active')}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
