# @cookie-baker/react

## Install

```
yarn add @cookie-baker/core @cookie-baker/browser
```

or

```
npm install @cookie-baker/core @cookie-baker/browser
```

## Example

```tsx
import React from "react"
import {
  Cookie as CookieClient,
  createRealTimeCookie,
} from "@cookie-baker/browser"

type CookieModel = {
  ga?: string
  adc?: string
}

const cookie = new CookieClient<CookieModel>()
const realTimeCookie = createRealTimeCookie(cookie)

const handler = console.log
realTimeCookie.addListener(handler)

cookie.set("ga", "ga-value")
cookie.set("adc", "adc-value", { httpOnly: true })
cookie.remove("adc")
console.log(cookie.get())

realTimeCookie.removeListener(handler)
```
