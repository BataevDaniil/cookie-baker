import { CookieController, CookieObjectModel } from "@cookie-baker/core"

import { isShallowEqual } from "../../../shared"

type Executor<T extends CookieObjectModel> = (cookie: Partial<T>) => void
export interface Task<T extends CookieObjectModel> {
  setTask(task: Executor<T>): void
  start(): void
  stop(): void
}

export class TaskCookieRequestAnimationFrame<T extends CookieObjectModel>
  implements Task<T>
{
  readonly #cookie: CookieController<T>
  #prevCookie: Partial<T> = {}
  #task: Executor<T> = () => {}
  #isExecuting = false
  #cancelId = 0

  constructor(cookieController: CookieController<T>) {
    this.#cookie = cookieController
  }

  private _task() {
    const cookie = this.#cookie.get()
    if (!isShallowEqual(cookie, this.#prevCookie)) {
      this.#task(cookie)
      this.setCash(cookie)
    }
    if (this.#isExecuting) {
      this.execute()
    }
  }
  private execute() {
    this.#cancelId = requestAnimationFrame(this._task.bind(this))
  }
  private setCash(cookie: Partial<T>) {
    this.#prevCookie = cookie
  }
  setTask(task: Executor<T>) {
    this.#task = task
  }
  stop() {
    this.#isExecuting = false
    cancelAnimationFrame(this.#cancelId)
  }
  start() {
    if (!this.#isExecuting) {
      this.execute()
      this.#isExecuting = true
      this.setCash(this.#cookie.get())
    }
  }
}
