import { User } from "./user"

export interface Hero {
    id:string
    imagePath:string
    amountOfTrainingsToday:number
    level:number
    name: string
    lastTrainingDate:Date
    owner:User|null
    description:string
}
