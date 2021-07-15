import { DBConstants } from "./DBConstants";
//
export class FetchClient {
    //
    private static readonly _JSON_APPLICATION = 'application/json';
    private static readonly _MODE_CORS = 'cors';
    private static readonly _METHOD_HEAD = 'HEAD';
    private static readonly _METHOD_GET = 'GET';
    private static readonly _METHOD_PUT = 'PUT';
    private static readonly _METHOD_POST = 'POST';
    private static readonly _METHOD_DELETE = 'DELETE';

    //
    private static readonly _HTTP_OK = 200;
    private static readonly _HTTP_MODIFIED = 304;
    private static readonly _HTTP_ERR = 400;
    //
    private readonly _credentials: string;
    //
    constructor(username?: string, password?: string) {
        this._credentials = DBConstants.GetCredentials(username, password);
    }// constructor
    //
    public async isOnLineAsync(url: string): Promise<boolean> {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_HEAD,
                mode: FetchClient._MODE_CORS,
            });
            return response.status === FetchClient._HTTP_OK;
        } catch (_err) {
            console.log(_err);
        }
        return false;
    } // isOnLine
    public async headAsync(url: string): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_HEAD,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status === FetchClient._HTTP_OK) {
                return response.headers;
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } //  headAsync
    public async getAsync(url: string): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                headers: {
                    Accept: FetchClient._JSON_APPLICATION,
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_GET,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status === FetchClient._HTTP_OK || response.status === FetchClient._HTTP_MODIFIED) {
                return response.json();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // getAsync
    public async getBlobDataAsync(url: string): Promise<ArrayBuffer | undefined> {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_GET,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status === FetchClient._HTTP_OK || response.status === FetchClient._HTTP_MODIFIED) {
                return response.arrayBuffer();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // getBlobDataAsync
    public async putAsync(url: string, data: any): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    Accept: FetchClient._JSON_APPLICATION,
                    'Content-Type': FetchClient._JSON_APPLICATION,
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_PUT,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status < FetchClient._HTTP_ERR) {
                return response.json();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // putAsync
    public async putBlobAsync(url: string, mime: string, data: Blob | Buffer): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                body: data,
                headers: {
                    Accept: FetchClient._JSON_APPLICATION,
                    'Content-Type': mime,
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_PUT,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status < FetchClient._HTTP_ERR) {
                return response.json();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // putBlobAsync
    public async postAsync(url: string, data: any): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    Accept: FetchClient._JSON_APPLICATION,
                    'Content-Type': FetchClient._JSON_APPLICATION,
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_POST,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status < FetchClient._HTTP_ERR) {
                return response.json();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // postAsync
    public async deleteAsync(url: string): Promise<any | undefined> {
        try {
            const response = await fetch(url, {
                headers: {
                    Accept: FetchClient._JSON_APPLICATION,
                    Authorization: this._credentials
                },
                method: FetchClient._METHOD_DELETE,
                mode: FetchClient._MODE_CORS,
            });
            if (response.status < FetchClient._HTTP_ERR) {
                return response.json();
            }
        } catch (_err) {
            console.log(_err);
        }
        return undefined;
    } // deleteAsync
} // class FetchClient
