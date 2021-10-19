import { Listener } from "../../shared"

export { Cookie } from "./Cookie"
export type {
  CookieController,
  CookieAttributes,
  CookieObjectModel,
} from "./Cookie"

export interface RealTimeCookie<T> extends Listener<T> {}
