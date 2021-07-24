import { Emitter, Listener, Subscriber } from "./emitter"

import { CookieObjectModel } from "./Cookie"
import { Task } from "./Task"

export interface IRealTimeCookie<T> extends Listener<T> {}

export class RealTimeCookiePlug implements IRealTimeCookie<never> {
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

export class RealTimeCookie<T extends CookieObjectModel>
  implements IRealTimeCookie<Partial<T>>
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
