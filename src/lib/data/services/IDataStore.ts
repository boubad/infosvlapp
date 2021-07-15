// IDataStore.ts
//
export interface IDataStore {
    synchroDataAsync(): Promise<void>;
    isOnLineAsync(): Promise<boolean>;
    formBlobUrl(id?: string, name?: string): string;
    getBlobDataAsync(id: string, name: string): Promise<ArrayBuffer | undefined>;
    findDocByIdAsync(id: string): Promise<any | undefined>;
    findDocBySelectorAsync(sel: any,fields?: string[]): Promise<any | undefined>;
    findDocRevisionAsync(sid: string): Promise<string | undefined>;
    maintainsDocAsync(doc: any): Promise<string | undefined>;
    removeDocAsync(id: string): Promise<boolean>;
    maintainsBlobAsync(
        id: string,
        name: string,
        mime: string,
        data: Blob | Buffer,
    ): Promise<string | undefined>;
    removeBlobAsync(id: string, name: string): Promise<boolean>;
    findDocsBySelectorAsync(
        sel: any,
        start?: number,
        count?: number,
        fields?: string[],
        sort?: any[]
    ): Promise<any[]>;
    findAllDocsBySelectorAsync(
        sel: any,
        fields?: string[],
        sort?: any[]
    ): Promise<any[]>;
    findAllDocsIdsBySelectorAsync(
        sel: any,
    ): Promise<string[]>;
    findDocsCountBySelectorAsync(sel: any): Promise<number>;
    maintainsManyDocsAsync(docs: any[]): Promise<void>;
    bulkGetAsync(ids: string[]): Promise<any[]>;
    removeDocsBySelectorAsync(sel: any): Promise<boolean>;
} // interface IDataStore
