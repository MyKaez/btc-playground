import { Injectable } from "@angular/core";

@Injectable()
export class CacheService {
    private readonly globalKey = "FixesThis";

    private cache: Record<string,any> = {};
    private cacheToSave: Record<string,any> = {};

    constructor() {
        try {
            const storageString = localStorage[this.globalKey];
            if(storageString) {
                this.cache = JSON.parse(storageString);
                this.cacheToSave = JSON.parse(storageString);
            }
            else console.warn("Storage has not been not set, yet");
        }
        catch(error) {
            console.error("Failed reading local storage for cache service", error);
        }
    }

    set(key: string, value: any, save = false) {
        this.cache[key] = value;

        if(save) {
            this.cacheToSave[key] = value;
            localStorage[this.globalKey] = JSON.stringify(this.cacheToSave);
        }
    }

    get<T>(key: string): T {
        return this.cache[key];
    }

    remove(key: string) {
        delete this.cache[key];
        delete this.cacheToSave[key];
        localStorage[this.globalKey] = JSON.stringify(this.cacheToSave);
    }
}