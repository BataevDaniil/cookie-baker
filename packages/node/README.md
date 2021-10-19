# @cookie-baker/react

## Install

```
yarn add @cookie-baker/core @cookie-baker/node
```

or

```
npm install @cookie-baker/core @cookie-baker/node
```

## Example

```tsx
import React from "react"
import { Cookie as CookieServer } from "@cookie-baker/node"

type CookieModel = {
  ga?: string
  adc?: string
}
const request = ({ req, res }) => {
  const cookie = new CookieServer<CookieModel>({ req, res })
  cookie.set("ga", "ga-value")
  cookie.set("adc", "adc-value", { httpOnly: true })
  console.log(cookie.get())
}
```
