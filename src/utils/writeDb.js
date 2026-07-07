import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function writeDB(data) {
    await fs.writeFile(
        dbPath,
        JSON.stringify(data, null, 2)
    );
}