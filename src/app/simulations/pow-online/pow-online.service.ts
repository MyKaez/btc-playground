import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, map, Observable, of, Subject, tap } from "rxjs";
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from "src/environments/environment";
import { Message, Session, SessionAction, SessionControlInfo, SessionInfo } from "src/model/api";
import { CacheService } from "src/app/shared/helpers";

@Injectable()
export class PowOnlineService {
    private readonly url = environment.apiUrl;
    constructor(private httpClient: HttpClient, private cache: CacheService) {
        
    }

    /*async createSession(name: string): Promise<Session> {
        const response = this.httpClient.post(`${environment.apiUrl}/v1/sessions`, {name: name});

        let value = await lastValueFrom(response);
        console.log("create session response", value);
        return {} as Session;
    }*/

    getAll(): Observable<SessionInfo[]> {
        return this.httpClient.get(`${this.url}/v1/sessions`).pipe(
            map(value => <SessionInfo[]>value)
        )
    }

    getSession(sessionId: string): Observable<SessionInfo> {
        return this.httpClient.get(`${this.url}/v1/sessions/${sessionId}`).pipe(
            map(value => <SessionInfo>value)
        )
    }

    private createSessionSubject = new Subject<SessionControlInfo>;
    lastCreatedSession$ = this.createSessionSubject.asObservable();
    createSession(sessionName: string): Observable<SessionControlInfo> {
        let createdSession$ = this.httpClient.post(`${this.url}/v1/sessions`, {
            name: sessionName
        }).pipe(map(session => <SessionControlInfo>session));
        
        createdSession$.subscribe(session => {
            this.cache.set("lastSession", session, true);
            this.createSessionSubject.next(session);
        });

        return createdSession$;
    }

    storedSession$ = of(this.cache.get("lastSession") as SessionControlInfo);

    sendMessage(session: SessionControlInfo, message: Message): Observable<SessionInfo> {
        const req = {
            controlId: session.controlId,
            ...message
        };
        return this.httpClient.post(`${this.url}/v1/sessions/${session.id}/messages`, req).pipe(
            map(value => <SessionInfo>value)
        )
    }

    executeAction(session: SessionControlInfo, action: SessionAction, configuration: any): Observable<SessionInfo> {
        const req = {
            controlId: session.controlId,
            action: action,
            configuration: configuration
        };
        return this.httpClient.post(`${this.url}/v1/sessions/${session.id}/actions`, req).pipe(
            map(value => <SessionInfo>value)
        )
    }

    connect(init: (connection: HubConnection) => void, onStart: (connection: HubConnection) => void): HubConnection {
        const connection = new HubConnectionBuilder()
            .withUrl(`${this.url}/sessions-hub`)
            .build();

        init(connection);

        connection.start()
            .then(() => {
                console.log('connection started');
                onStart(connection);
            })
            .catch((err) => console.log('error while establishing signalr connection: ' + err));

        return connection;
    }
}