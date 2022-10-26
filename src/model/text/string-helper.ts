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
}