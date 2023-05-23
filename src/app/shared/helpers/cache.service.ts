import { Injectable } from "@angular/core";

@Injectable()
export class CacheService {
    private readonly globalKey = "FixesThis";

    private cache: Record<string,any> = {};

    constructor() {
        try {
            const storageString = localStorage[this.globalKey];
            if(storageString) this.cache = JSON.parse(storageString);
            else console.warn("Storage has not been not set, yet");
        }
        catch(error) {
            console.error("Failed reading local storage for cache service", error);
        }
    }

    set(key: string, value: any, save = false) {
        this.cache[key] = value;

        if(save) localStorage[this.globalKey] = JSON.stringify(this.cache);
    }

    get<T>(key: string): T {
        return this.cache[key];
    }
}