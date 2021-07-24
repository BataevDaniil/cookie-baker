export type Subscriber<T> = (value: T) => void

export interface Listener<T> {
  addListener(f: Subscriber<T>): void
  removeListener(f: Subscriber<T>): void
}

export class Emitter<T> implements Listener<T> {
  private subscribers: Array<Subscriber<T>> = []

  get hasSubscribers() {
    return Boolean(this.subscribers.length)
  }

  addListener(f: Subscriber<T>) {
    this.subscribers.push(f)
  }

  removeListener(fOnRemove: Subscriber<T>) {
    this.subscribers = this.subscribers.filter((f) => f !== fOnRemove)
  }

  emit(value: T) {
    this.subscribers.forEach((f) => f(value))
  }
}
