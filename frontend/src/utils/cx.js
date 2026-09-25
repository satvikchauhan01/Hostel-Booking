/** tiny className joiner: cx('a', cond && 'b', undefined) -> 'a b' */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
