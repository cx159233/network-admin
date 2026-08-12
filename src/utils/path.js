// Browser-compatible replacement for Node's 'path' module
// Vite stubs 'path' to an empty object in browser context, breaking path.resolve

export function resolve(...segments) {
  let result = ''
  for (const seg of segments) {
    if (seg === undefined || seg === null || seg === '') continue
    if (seg.startsWith('/')) {
      result = seg
    } else {
      result = result ? result.replace(/\/$/, '') + '/' + seg : '/' + seg
    }
  }
  const parts = result.split('/')
  const resolved = []
  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
    } else if (part === '.' || part === '') {
      continue
    } else {
      resolved.push(part)
    }
  }
  return '/' + resolved.join('/')
}
