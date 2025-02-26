import { RTNFileManager } from "./rn-modules";

/**
 * Removes all files in a directory from the path given
 * @param path Path to the targeted directory
 */
export async function clearFolder(path: string, prefix = "pyoncord/") {
    if (typeof RTNFileManager.clearFolder !== "function") throw new Error("'fs.clearFolder' is not supported");
    return void (await RTNFileManager.clearFolder("documents", `${prefix}${path}`));
}

/**
 * Remove file from given path, currently no check for any failure
 * @param path Path to the file
 */
export async function removeFile(path: string, prefix = "pyoncord/") {
    if (typeof RTNFileManager.removeFile !== "function") throw new Error("'fs.removeFile' is not supported");
    return void (await RTNFileManager.removeFile("documents", `${prefix}${path}`));
}

/**
 * Check if the file or directory given by the path exists
 * @param path Path to the file
 */
export async function fileExists(path: string, prefix = "pyoncord/") {
    return await RTNFileManager.fileExists(`${RTNFileManager.getConstants().DocumentsDirPath}/${prefix}${path}`);
}

/**
 * A wrapper to write to a file to the documents directory
 * @param path Path to the file
 * @param data String data to write to the file
 */
export async function writeFile(path: string, data: string, prefix = "pyoncord/"): Promise<void> {
    if (typeof data !== "string") throw new Error("Argument 'data' must be a string");
    return void (await RTNFileManager.writeFile("documents", `${prefix}${path}`, data, "utf8"));
}

/**
 * A wrapper to read a file from the documents directory
 * @param path Path to the file
 * @param fallback Fallback data to return if the file doesn't exist, and will be written to the file
 */
export async function readFile(path: string, prefix = "pyoncord/"): Promise<string> {
    try {
        return await RTNFileManager.readFile(
            `${RTNFileManager.getConstants().DocumentsDirPath}/${prefix}${path}`,
            "utf8",
        );
    } catch (err) {
        throw new Error(`An error occured while reading '${path}'`, { cause: err });
    }
}

export async function downloadFile(url: string, path: string, prefix = "pyoncord/") {
    const blob = await fetch(url).then((r) => r.blob());
    const dataURL: string | null = await new Promise((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as unknown as string);
        reader.readAsDataURL(blob);
    });

    let data: string;
    if (dataURL == null) {
        throw new Error("Failed to convert blob to data URL");
    }
    const index = dataURL.indexOf("base64,");
    if (index === -1) throw new Error("dataURL does not contain base64");
    data = dataURL.slice(index + 7);

    return void (await RTNFileManager.writeFile("documents", `${prefix}${path}`, data, "base64"));
}

// // thanks Rosie, doesnt work though
// export async function downloadFile(url: string, path: string, prefix = "pyoncord/") {
//     const arrayBuffer = await fetch(url).then(r => r.arrayBuffer());
//     const data = Buffer.from(arrayBuffer).toString("base64");

//     return void await FileManager.writeFile("documents", `${prefix}${path}`, data, "base64");
// }
