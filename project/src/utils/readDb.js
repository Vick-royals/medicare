import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function readDB() {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
}