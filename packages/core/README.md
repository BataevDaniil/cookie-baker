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
import { Cookie } from "@cookie-baker/core"

type CookieModel = {
  ga?: string
  adc?: string
}

const cookie = new Cookie<CookieModel>()
console.log(cookie.parse("ga=ga-value;adc=adc-value"))
console.log(cookie.stringify("ga", "ga-value"))
console.log(cookie.stringify("adc", "adc-value", { httpOnly: true }))
```
