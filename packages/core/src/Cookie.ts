export interface CookieAttributes {
  maxAge?: number
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
  httpOnly?: boolean
}

export type CookieObjectModel = Partial<{ [key: string]: string }>

export interface CookieController<T extends CookieObjectModel> {
  get(): Partial<T>
  set(name: keyof T, value: string, options?: CookieAttributes): void
  remove(name: keyof T): void
}

export class Cookie<T extends CookieObjectModel> {
  // TODO: add stringify all cookie
  stringify(name: keyof T, value: string, options?: CookieAttributes): string {
    const key = encodeURIComponent(name as string)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    return `${key}=${converter.write(value)}${stringifyAttrs(options ?? {})}`
  }
  // TODO: add parse with attribute in new method
  parse(cookie: string): Partial<T> {
    if (cookie === "") {
      return {}
    }
    return cookie
      .split("; ")
      .map((x) => x.split("="))
      .reduce((acc, [key, ...value]) => {
        // @ts-ignore
        acc[converter.read(key)] = converter.read(value.join("="))
        return acc
      }, {})
  }
}

const stringifyAttrs = (options: CookieAttributes): string => {
  let attrs = ""
  if (options.maxAge) attrs += `; max-age=${options.maxAge}`
  if (options.path) attrs += `; path=${options.path}`
  if (options.expires) attrs += `; expires=${options.expires.toUTCString()}`
  if (options.domain) attrs += `; domain=${options.domain}`
  if (options.sameSite) attrs += `; samesite=${options.sameSite}`
  if (options.secure) attrs += "; secure"
  if (options.httpOnly) attrs += "; httponly"
  return attrs
}

const converter = {
  read: (value: string): string =>
    value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent),
  write: (value: string): string =>
    encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent,
    ),
}
