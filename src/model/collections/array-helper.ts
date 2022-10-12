export class ArrayHelper {
    /**
     * Moves element from one array to another
     * @param element Element to move
     * @param first First array to check
     * @param second Second array to check
     * @returns Extended array
     */
    static swapElement<T>(element: T, first: T[], second: T[]): T[] {
        let belongsToFirst = first.indexOf(element) >= 0;
        let from = belongsToFirst ? first : second;
        let to = belongsToFirst ? second : first;

        from.splice(from.indexOf(element), 1);
        to.push(element);
        return to;
    }
}