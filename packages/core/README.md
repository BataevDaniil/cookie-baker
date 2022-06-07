# @cookie-baker/core

## Install

```
yarn add @cookie-baker/core
```

or

```
npm install @cookie-baker/core
```

## Example

```tsx
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
