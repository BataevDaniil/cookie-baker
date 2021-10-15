import { isObject } from "./isObject"

export const isShallowEqual = (a: any, b: any) => {
  if (Object.is(a, b)) {
    return true
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    return (
      aKeys.length == bKeys.length && aKeys.every((k) => Object.is(a[k], b[k]))
    )
  }
  return false
}
