import mongoose, {ConnectOptions} from "mongoose";
import {InsertOneResult, MongoClient, ServerApiVersion} from "mongodb";
import type {InstructionSet} from "~/mongo/model";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "inst-set";
const COLLECTION_NAME = "inst-set";


export class InstSetRepo {
    private static instance: InstSetRepo;
    private mongoClient: MongoClient;

    private constructor() {
        const mongoOptions = {} as ConnectOptions;
        this.mongoClient = new MongoClient(MONGO_URL, mongoOptions);
    }

    public static getInstance(): InstSetRepo {
        if (!InstSetRepo.instance) {
            InstSetRepo.instance = new InstSetRepo();
        }
        return InstSetRepo.instance;
    }

    async checkClient(): Promise<void> {
        try {
            await this.mongoClient.db(DB_NAME).command({ ping: 1 });
        } catch (error) {
            console.error("Connection to MongoDB lost. Attempting to reconnect...", error);
            await this.mongoClient.connect();
        }
    }

    async save(instructionSet: InstructionSet): Promise<InstructionSet> {
        await this.checkClient()
        const existingSet = await this.findById(instructionSet.id);
        if (existingSet) {
            await this.mongoClient.db(DB_NAME).collection(COLLECTION_NAME).updateOne({
                id: instructionSet.id,
            }, {
                $set: {
                    tags: instructionSet.tags,
                    instructions: instructionSet.instructions,
                    modified: instructionSet.modified,
                },
            });
        } else {
            const result: InsertOneResult = await this.mongoClient.db(DB_NAME).collection(COLLECTION_NAME).insertOne(instructionSet);
            if (!result.acknowledged) {
                throw new Error('Insert operation failed');
            }
        }
        return instructionSet;
    }

    async findById(id: string): Promise<InstructionSet | null> {
        await this.checkClient()
        const result = await this.mongoClient.db(DB_NAME).collection(COLLECTION_NAME).findOne({ id });
        if (!result) return null;
        return {
            id: result["id"],
            tags: result["tags"],
            instructions: result["instructions"],
            modified: result["modified"]
        }
    }

    async findAll(): Promise<InstructionSet[]> {
        await this.checkClient()
        const result = await this.mongoClient.db(DB_NAME).collection(COLLECTION_NAME).find({}).toArray();
        return result.map(item => ({
            id: item.id,
            tags: item.tags,
            instructions: item.instructions,
            modified: item.modified,
        }));
    }

    async deleteById(id: string): Promise<boolean> {
        await this.checkClient()
        const result = await this.mongoClient.db(DB_NAME).collection(COLLECTION_NAME).deleteOne({ id });
        return result.deletedCount === 1;
    }
}