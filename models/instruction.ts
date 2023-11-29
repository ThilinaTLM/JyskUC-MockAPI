
export interface Instruction {
    [key: string]: Instruction | string | number | boolean
}

export interface InstructionSet {
    id: string
    tags: string[]
    instructions: Instruction[]
    modified: Date
}