import { IncomingMessage, ServerResponse } from "http"
import {
  Cookie,
  CookieAttributes,
  CookieController,
  CookieObjectModel,
} from "@cookie-baker/core"

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
