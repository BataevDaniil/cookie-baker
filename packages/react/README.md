# @cookie-baker/react

## Install

```
yarn add @cookie-baker/core @cookie-baker/react
```

or

```
npm install @cookie-baker/core @cookie-baker/react
```

### browser

```
yarn add @cookie-baker/browser
```

or

```
npm install @cookie-baker/browser
```

### node

```
yarn add @cookie-baker/node
```

or

```
npm install @cookie-baker/node
```

## Example

### Browser

```tsx
import React from "react"
import {
  Cookie as CookieClient,
  createRealTimeCookie,
} from "@cookie-baker/browser"
import { createUseCookie } from "@cookie-baker/react"

type CookieModel = {
  ga?: string
  adc?: string
}
const cookie = new CookieClient<CookieModel>()
const realTimeCookie = createRealTimeCookie(cookie)
const useCookie = createUseCookie(cookie, realTimeCookie)

const Component = () => {
  const ga = useCookie(({ ga }) => ga)
  React.useEffect(() => {
    console.log("update ga", ga)
  }, [ga])

  const cookieData = useCookie()
  React.useEffect(() => {
    cookie.set("ga", "ga-value")
    console.log(cookie.get())
    console.log("update cookie", cookieData)
  }, [cookieData])
  return null
}
```

### SSR

```tsx
import { CookieController, RealTimeCookie } from "@cookie-baker/core"
import {
  Cookie as CookieClient,
  isBrowser,
  createRealTimeCookie,
} from "@cookie-baker/browser"
import {
  createUseCookie,
  useCookie as useCookieType,
} from "@cookie-baker/react"
import { Cookie as CookieServer } from "@cookie-baker/node"

type CookieModel = {
  ga?: string
  adc?: string
}
let cookie: CookieController<CookieModel>
let realTimeCookie: RealTimeCookie<CookieModel>
let useCookie: useCookieType<CookieModel>

const createCookie = (_cookie: typeof cookie) => {
  cookie = _cookie
  realTimeCookie = createRealTimeCookie(_cookie)
  useCookie = createUseCookie(_cookie, realTimeCookie)
}
if (isBrowser()) {
  createCookie(new CookieClient<CookieModel>())
}

const Component = () => {
  const ga = useCookie(({ ga }) => ga)
  React.useEffect(() => {
    console.log("update ga", ga)
  }, [ga])

  const cookieData = useCookie()
  React.useEffect(() => {
    cookie.set("ga", "ga-browser-value")
    console.log(cookie.get())
    console.log("update cookie", cookieData)
  }, [cookieData])
  return null
}

export const getServerSideProps = ({ req, res }) => {
  createCookie(new CookieServer<CookieModel>({ req, res }))
  cookie.set("ga", "ga-server-value")
  cookie.set("adc", "adc-value", { httpOnly: true })
  console.log(cookie.get())
  return { props: {} }
}

export default Component
```
