import {
  Cookie,
  CookieAttributes,
  CookieController,
  CookieObjectModel,
} from "@cookie-baker/core"

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
