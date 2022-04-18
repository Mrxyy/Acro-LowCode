import { each } from 'lodash';
// DFS
export function execRecursively(
  fn: (any, key?: string | number) => any,
  subject: any[] | Record<string, any>,
  // filterFX: (any) => boolean,
  _key?: string | number,
  _refs: WeakSet<any> = null
) {
  if (!_refs) _refs = new WeakSet();

  // 避免无限递归
  if (_refs.has(subject)) return;
  fn(subject, _key);

  if ('object' === typeof subject) {
    _refs.add(subject);
    each(subject, (val, key) => {
      execRecursively(fn, val, key, _refs);
    });
  }
}
// BFS
