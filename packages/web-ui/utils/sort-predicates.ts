export function alphaAscSortPredicate(a: string, b: string) {
  return a.localeCompare(b);
}

export function alphaDescSortPredicate(a: string, b: string) {
  return b.localeCompare(a);
}
