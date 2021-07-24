import { IncomingMessage, ServerResponse } from "http"

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
  static converter = {
    read: function (value: string): string {
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value: string): string {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent,
      )
    },
  }
  static stringifyAttrs = (options: CookieAttributes): string => {
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
  // TODO: add stringify all cookie
  stringify(name: keyof T, value: string, options?: CookieAttributes): string {
    const key = encodeURIComponent(name as string)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    return `${key}=${Cookie.converter.write(value)}${Cookie.stringifyAttrs(
      options ?? {},
    )}`
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
        acc[Cookie.converter.read(key)] = Cookie.converter.read(value.join("="))
        return acc
      }, {})
  }
}

export class CookieClient<T extends CookieObjectModel>
  implements CookieController<T>
{
  #cookie = new Cookie<T>()
  get(): Partial<T> {
    return this.#cookie.parse(document.cookie)
  }
  set(name: keyof T, value: string, options?: CookieAttributes) {
    document.cookie = this.#cookie.stringify(name, value, options)
  }
  remove(name: keyof T) {
    this.set(name, "", { maxAge: -1 })
  }
}

export class CookieServer<T extends CookieObjectModel>
  implements CookieController<T>
{
  readonly #res: ServerResponse
  readonly #req: IncomingMessage
  readonly #cookie = new Cookie<T>()

  constructor({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    this.#req = req
    this.#res = res
  }

  private getHeaders(): string[] {
    // TODO: header posible set-cookie
    const resHeader = this.#res.getHeader("Set-Cookie") ?? []
    return Array.isArray(resHeader) ? [...resHeader] : [String(resHeader)]
  }

  get(): Partial<T> {
    return {
      ...this.#cookie.parse(this.#req.headers.cookie ?? ""),
      ...this.getHeaders()
        .map(this.#cookie.parse)
        .reduce((acc, cookie) => {
          const [[key, value] = []] = Object.entries(cookie)
          if (key === undefined) {
            return acc
          }
          return { ...acc, [key]: value }
        }, {}),
    }
  }
  set(name: keyof T, value: string, options?: CookieAttributes) {
    const headers = this.getHeaders().filter(
      (header) => !header.startsWith(`${name}=`),
    )
    headers.push(this.#cookie.stringify(name, value, options))

    this.#res.setHeader("Set-Cookie", headers)
  }
  remove(name: keyof T) {
    this.set(name, "", {
      maxAge: -1,
    })
  }
}
