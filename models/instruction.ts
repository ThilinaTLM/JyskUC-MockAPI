
export interface Instruction {
    [key: string]: Instruction | string | number | boolean
}

export interface InstructionSet {
    id: string
    name: string
    description: string
    tags: string[]
    created: Date
    modified: Date
    instructions: Instruction[]
}