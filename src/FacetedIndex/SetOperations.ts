function intersectAll<T>(sets: Set<T>[]): Set<T> {
  var result = sets[0] || new Set<T>();
  for (let s of sets.slice(1)) {
    result = new Set([...Array.from(result)].filter((x) => s.has(x)));
  }
  return result;
}

function unionAll<T>(sets: Set<T>[]): Set<T> {
  let result = new Set<T>();
  for (let s of sets) {
    for (let x of Array.from(s)) {
      result.add(x);
    }
  }
  return result;
}

export { intersectAll, unionAll };
