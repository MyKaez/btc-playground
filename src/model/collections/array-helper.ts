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

    static selectFor(times: number, startAt = 0, step = 1): number[] {
        const elements: number[] = [];
        if(!step) return elements;

        const target = startAt + times * (step > 0 ? 1 : -1);
        const compareForRunning = step > 0 
            ? () => startAt < target
            : () => startAt > target;

        while(compareForRunning()) {
            elements.push(startAt);
            startAt += step;
        }

        return elements;
    }

    static areArraysEqual<T>(left?: T[], right?: T[], compareOrder = false, compareElement?: (first: T, second: T) => boolean): boolean {
        if(left == right) return true;
        if(!left || !right) return false;
        if(left.length != right.length) return false;

        if(!compareElement) compareElement = (first: T, second: T) => first === second;
        if(compareOrder) return !left.some((element, i) => {
            return compareElement!(element, right[i]);
        });

        const matches: T[] = [];
        left.forEach(first => {
            const match = right.find(second => matches.indexOf(second) === -1 && compareElement!(first, second));
            if(match) matches.push(match);
        });

        return matches.length === left.length;
    }
}