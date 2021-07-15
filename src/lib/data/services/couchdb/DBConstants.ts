//const nodeBtoa = (b:string) => Buffer.from(b).toString('base64');
//const base64encode = typeof btoa !== 'undefined' ? btoa : nodeBtoa;
export class DBConstants {
    private static readonly _DB_HOST = 'http://services.diarra.ovh:5984';
    private static readonly _DB_NAME = 'testd';
    private static readonly _DB_USER = 'boubad';
    private static readonly _DB_PASSWORD = 'bouba256';
    //
    public static GetCredentials(username?: string, password?: string): string {
        const user = (username !== undefined && username !== null) ? username.trim() : DBConstants._DB_USER;
        const spass = (password !== undefined && password !== null) ? password : DBConstants._DB_PASSWORD;
        const s = user + ":" + spass;
        return 'Basic ' + btoa(s);
    }// getCredentials
    public static GetDefaultHost(): string {
        return this._DB_HOST;
    }
    public static GetDefaultDatabase(): string {
        return this._DB_NAME;
    }
    public static GetUrl(host?: string, database?: string): string {
        const s1 = (host != undefined && host != null) ? host : DBConstants.GetDefaultHost();
        const s2 = (database !== undefined && database !== null) ? database.trim().toLowerCase() : DBConstants.GetDefaultDatabase();
        const s = s1 + "/" + s2 + "/";
        return s;
    }
}// class DBConstants

