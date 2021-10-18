import {
  CookieObjectModel,
  CookieController,
  RealTimeCookie,
} from "@cookie-baker/core"

import { isBrowser } from "../isBrowser"
import { Emitter, Subscriber } from "../../../shared"

import { Task, TaskCookieRequestAnimationFrame } from "./Task"

class RealTimeCookiePlug implements RealTimeCookie<never> {
  addListener() {
    if (process.env.NODE_ENV !== "test") {
      console.error("RealTimeCookie should not use in server render")
    }
  }
  removeListener() {
    if (process.env.NODE_ENV !== "test") {
      console.error("RealTimeCookie should not use in server render")
    }
  }
}

class RealTimeCookieClass<T extends CookieObjectModel>
  implements RealTimeCookie<Partial<T>>
{
  readonly #emitter = new Emitter<Partial<T>>()
  readonly #task: Task<T>

  constructor(task: Task<T>) {
    this.#task = task
    this.#task.setTask((cookie) => this.#emitter.emit(cookie))
  }

  addListener(f: Subscriber<Partial<T>>) {
    this.#emitter.addListener(f)
    this.#task.start()
  }
  removeListener(f: Subscriber<Partial<T>>) {
    this.#emitter.removeListener(f)
    if (!this.#emitter.hasSubscribers) {
      this.#task.stop()
    }
  }
}

export const createRealTimeCookie = <T extends CookieObjectModel>(
  Cookie: CookieController<T>,
): RealTimeCookie<Partial<T>> =>
  isBrowser()
    ? new RealTimeCookieClass(new TaskCookieRequestAnimationFrame(Cookie))
    : new RealTimeCookiePlug()
