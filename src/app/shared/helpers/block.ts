export const BLOCK_ID_LENGTH: number = 64;

export function createBlockId(): string {
    // origins from here: https://www.cloudhadoop.com/javascript-uuid-tutorial/#:~:text=Typescript%20-%20generate%20UUID%20or%20GUID%20with%20an,directly%20use%20the%20uuid%20%28%29%20function%20as%20below.
    let uuidValue = "", k, randomValue;
    for (k = 0; k < BLOCK_ID_LENGTH; k++) {
        randomValue = Math.random() * 16 | 0;
        uuidValue += randomValue.toString(16);
    }
    return uuidValue;
}