export enum KataLevel {
    BASIC = 'Basic',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface IKata {
    name: string,
    description: string,
    level: KataLevel,
    intents: number,
    stars: number,
    creator: string, // Id of user
    solution: string,
    participants: string[]
}