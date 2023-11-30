import mongoose, {ConnectOptions} from "mongoose";
import {InsertOneResult, MongoClient} from "mongodb";
import type {InstructionSet} from "~/mongo/model";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "inst-set";
const COLLECTION_NAME = "inst-set";

export const mongoClient = new MongoClient(MONGO_URL);

export const InstSetRepo = {
    async connect() {
        await mongoClient.connect();
    },
    async disconnect() {
        await mongoClient.close();
    },
    async save(instructionSet: InstructionSet): Promise<InstructionSet> {
        const existingSet = await this.findById(instructionSet.id);
        if (existingSet) {
            await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).updateOne({
                id: instructionSet.id,
            }, {
                $set: {
                    tags: instructionSet.tags,
                    instructions: instructionSet.instructions,
                    modified: instructionSet.modified,
                },
            });
        } else {
            const result: InsertOneResult = await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).insertOne(instructionSet);
            if (!result.acknowledged) {
                throw new Error('Insert operation failed');
            }
        }
        return instructionSet;
    },
    async findById(id: string): Promise<InstructionSet | null> {
        const result = await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).findOne({ id });
        if (!result) return null;
        return {
            id: result["id"],
            tags: result["tags"],
            instructions: result["instructions"],
            modified: result["modified"]
        }
    },
    async findAll(): Promise<InstructionSet[]> {
        const result = await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).find({}).toArray();
        return result.map(item => ({
            id: item.id,
            tags: item.tags,
            instructions: item.instructions,
            modified: item.modified,
        }));
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).deleteOne({ id });
        return result.deletedCount === 1;
    }
}