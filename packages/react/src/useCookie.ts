import React from "react"
import {
  RealTimeCookie,
  CookieController,
  CookieObjectModel,
} from "@cookie-baker/core"

import { isShallowEqual } from "../../shared"

export interface useCookie<T extends CookieObjectModel> {
  (): Partial<T>
  <C>(cookie: (state: Partial<T>) => C): C
}

export const createUseCookie = <T extends CookieObjectModel>(
  cookie: CookieController<T>,
  realTimeCookie: RealTimeCookie<T>,
): useCookie<T> =>
  function useCookie<C>(select?: (cookie: Partial<T>) => C) {
    const newSelect = select ?? ((cookie: Partial<T>) => cookie)
    const selectMemo = React.useRef(newSelect)
    selectMemo.current = newSelect
    const [value, setValue] = React.useState(() =>
      selectMemo.current(cookie.get()),
    )

    const prevValue = React.useRef(value)
    React.useEffect(() => {
      const handler = (state: Partial<T>) => {
        const newValue = selectMemo.current(state)
        if (!isShallowEqual(prevValue.current, newValue)) {
          setValue(newValue)
          prevValue.current = newValue
        }
      }
      // @ts-ignore
      realTimeCookie.addListener(handler)
      // @ts-ignore
      return () => realTimeCookie.removeListener(handler)
    }, [])

    return value
  }
