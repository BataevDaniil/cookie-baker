import React from "react"
import { CookieController, CookieObjectModel } from "@cookie-baker/core"
import { RealTimeCookie } from "@cookie-baker/browser"

import { isShallowEqual } from "../../shared"

export interface useCookie<T extends CookieObjectModel> {
  (): Partial<T>
  <C>(cookie: (state: Partial<T>) => C): C
}

export const createUseCookie = <T extends CookieObjectModel>(
  RealTimeCookie: RealTimeCookie<T>,
  Cookie: CookieController<T>,
): useCookie<T> =>
  function useCookie<C>(select?: (cookie: Partial<T>) => C) {
    const newSelect = select ?? ((cookie: Partial<T>) => cookie)
    const selectMemo = React.useRef(newSelect)
    selectMemo.current = newSelect
    const [value, setValue] = React.useState(() =>
      selectMemo.current(Cookie.get()),
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
      RealTimeCookie.addListener(handler)
      return () => RealTimeCookie.removeListener(handler)
    }, [])

    return value
  }