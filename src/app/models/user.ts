import { Hero } from "./hero"

export interface User {
    heroes:Hero[]|null
    username:string
}
