import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { Session } from "src/model/api/session";

@Injectable()
export class PowOnlineService {
    constructor(private httpClient: HttpClient) {
        
    }

    async createSession(name: string): Promise<Session> {
        const response = this.httpClient.post(`${environment.apiUrl}/v1/sessions`, {name: name});

        let value = await lastValueFrom(response);
        console.log("create session response", value);
        return {} as Session;
    }
}