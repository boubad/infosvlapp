import { InfoDataStore } from "./InfoDataStore";

export class BaseServices {
    public datastore: InfoDataStore;
    constructor(baseurl?: string, databasename?: string, username?: string, password?: string) {
        this.datastore = new InfoDataStore(baseurl, databasename, username, password);
    }// constructor
    public async saveAttachmentAsync(
        docid: string,
        attName: string,
        mimeType: string,
        data: Blob | Buffer
    ): Promise<string | undefined> {
        if (!docid || !attName || !mimeType || !data) {
            return undefined;
        }
        const id = docid.trim();
        if (id.length < 1) {
            return undefined;
        }
        const store = this.datastore;
        const sid = await store.maintainsBlobAsync(id, attName, mimeType, data);
        if (!sid) {
            return undefined;
        }
        return sid;
    } //SaveAttachmentAsync
    public async removeAttachmentAsync(
        docid: string,
        attName: string
    ): Promise<string | undefined> {
        if (!docid || !attName) {
            return undefined;
        }
        const id = docid.trim();
        const name = attName.trim();
        if (id.length < 1 || name.length < 1) {
            return undefined;
        }
        await this.datastore.removeBlobAsync(id, attName);
        return docid;
    } //RemoveAttachmentAsync
    
    //
   
    //
}// class BaseServices
