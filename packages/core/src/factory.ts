import { isServer } from "./isServer"

import { CookieController, CookieObjectModel } from "./Cookie"
import {
  RealTimeCookie as RealTimeCookieClass,
  RealTimeCookiePlug,
} from "./RealTimeCookie"
import { TaskCookieRequestAnimationFrame } from "./Task"
import { factoryUseCookie } from "./useCookie"

export const factoryCookie = <T extends CookieObjectModel>(
  Cookie: CookieController<T>,
) => {
  const RealTimeCookie = isServer()
    ? new RealTimeCookiePlug()
    : new RealTimeCookieClass(new TaskCookieRequestAnimationFrame(Cookie))
  return {
    Cookie,
    RealTimeCookie,
    useCookie: factoryUseCookie(RealTimeCookie, Cookie),
  }
}
