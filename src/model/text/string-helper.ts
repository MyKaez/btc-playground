export class StringHelper {
    /**
     * Creates a GUID
     * @see https://stackoverflow.com/questions/26501688/a-typescript-guid-class
     */
    static createGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private static uiIds = 0;
    static createUiId(): number {
        return StringHelper.uiIds++;
    }    

    /** Renders a base string X times into the output */
    static renderCharacter(character: string, count: number, maxCount: number, removeLastCharacter = false, prefix = ""): string {
        if(count <= 0) return "";
        count = Math.min(maxCount, count);
        
        let text = character.repeat(count);
        if(prefix) text = prefix + text;
        return removeLastCharacter 
        ? text.substring(0, text.length - 1)
        : text;
    }
}