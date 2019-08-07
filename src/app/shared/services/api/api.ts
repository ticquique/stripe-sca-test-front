import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class Api {

    url = `${environment.api_url}/${environment.api_version}`;
    http: HttpClient = null;
    params: [string, any][];
    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(
        url = '',
        http: HttpClient,
        headers: [string, any][] = [],
        params: [string, any][] = []
        ) {
            this.url = url ? `${this.url}/${url}` : this.url;
            this.params = params;
            this.http = http;
            headers.forEach(val => this.headers = this.headers.set(...val));
    }

    // API: GET
    protected getAll<T>(url?: string, parameters: [string, any][] = []) {
        const newUrl = this.getUrl(url);
        const params = this.populateParams(parameters);
        return this.http.get<T>(newUrl, {headers: this.headers, params});
    }

    // API: POST
    protected create<T>(object: any, url?: string, parameters: [string, any][] = []) {
        const newUrl = this.getUrl(url);
        const params = this.populateParams(parameters);
        return this.http.post<T>(newUrl, object, {headers: this.headers, params});
    }

    // API: GET
    protected get<T>(objectId: string, url?: string, parameters: [string, any][] = []) {
        const newUrl = this.getUrl(url, objectId);
        const params = this.populateParams(parameters);
        return this.http.get<T>(newUrl, {params, headers: this.headers});
    }

    // API: PUT
    protected update<T>(objectId: string, newObject: any, url?: string, parameters: [string, any][] = []) {
        const newUrl = this.getUrl(url, objectId);
        const params = this.populateParams(parameters);
        return this.http.put<T>(newUrl, newObject, {params, headers: this.headers});
    }

    // API: DELETE
    protected delete(objectId: any, url?: string, parameters: [string, any][] = []) {
        const newUrl = this.getUrl(url, objectId);
        const params = this.populateParams(parameters);
        return this.http.delete(newUrl, {params, headers: this.headers});
    }

    populateParams(parameters: [string, any][] = []): HttpParams {
        let params = new HttpParams();
        this.params.forEach(val => params = params.set(...val));
        parameters.forEach(val => {
            if (val.length === 2
                // && val[0] !== null && val[0] !== undefined
                // && val[1] !== null && val[1] !== undefined
            ) {
                params = params.set(...val);
            }
        });
        return params;
    }

    getUrl(url: string, id?: string) {
        let result = url ? `${this.url}/${url}` : this.url;
        result = id ? `${result}/${id}` : result;
        return result;
    }
}

