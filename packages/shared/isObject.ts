export const isObject = (x: any): x is Record<keyof any, any> =>
  typeof x === "object" && x !== null
