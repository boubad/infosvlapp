import type { IBaseDoc } from "../domain/IBaseDoc";
import type { IDataOption } from "../domain/IDataOption";
import { BaseServices } from "./BaseServices";
import type {IItemPayload} from "./IItemPayload";

export class ItemServices<T extends IBaseDoc> extends BaseServices {
    protected _item: T;
    constructor(item: T, baseurl?: string, databasename?: string) {
        super(baseurl, databasename);
        this._item = item;
    }
    //
    protected async fetchUniqueId(_item: T): Promise<string | undefined> {
        return undefined;
    }//fetchUniqueId
    protected isStoreable(p: T): boolean {
        if (!p.doctype) {
            return false;
        }
        return p.doctype.trim().length > 0;
    }// getPersistMap
    protected getPersistMap(p: T): any {
        return Object.assign({}, p);
    }// getPersistMap
    protected getItemsFilter(): any {
        return {
            doctype: this._item.doctype,
        };
    }
    protected async getRefreshItems(_offset?:number,_limit?:number): Promise<IDataOption[]> {
        return [];
    }
    //
    public createNewItem(): IItemPayload<T> {
        return {
            item: Object.assign({}, this._item),
        };
    } //createNewItem
    public cancelEdit(): IItemPayload<T> {
        return {
        };
    }//cancelEdit
    //
    public changeFieldValue(
        item: T,
        fieldname: string,
        fieldvalue: any
    ): IItemPayload<T> {
        const pRet: IItemPayload<T> = {};
        if (fieldname === undefined || fieldname === null) {
            return pRet;
        }
        const current = Object.assign({}, item);
        ;
        current[fieldname] = fieldvalue;
        current._modified = true;
        pRet.item = current;
        return pRet;
    } //changeFieldValue
    public async selectItemAsync(id: string): Promise<IItemPayload<T>> {
        const pRet: IItemPayload<T> = {};
        const store = this.datastore;
        const p = await store.findItemByIdAsync(this._item, id);
        if (!p) {
            pRet.item = Object.assign({}, this._item);
            return pRet;
        }
        const pz: any = Object.assign({}, p);
        pRet.item = pz as T;
        return pRet;
    }//selectItemAsync
    public async saveItemAsync(item: T): Promise<IItemPayload<T>> {
        const pRet: IItemPayload<T> = {};
        if (!this.isStoreable(item)) {
            return pRet;
        }
        const store = this.datastore;
        const data = this.getPersistMap(item);
        const sx = await this.fetchUniqueId(item);
        if (sx && sx.length > 0) {
            data["_id"] = sx;
        }
        const id = await store.dataStore.maintainsDocAsync(data);
        if (!id) {
            return pRet;
        }
        if (id.length > 0) {
            store.clearItemById(id, this._item.doctype);
            return this.selectItemAsync(id);
        }
        return pRet;
    }//saveItemAsync
    public async removeItemAsync(p: T): Promise<boolean> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return false;
        }
        const b = await this.datastore.removeDocAsync(id);
        if (!p) {
            return false;
        }
        this.datastore.clearItemById(id, this._item.doctype);
        return true;
    }//removeItemAsync
    public async saveItemAttachmentAsync(
        item: T,
        attName: string,
        mimeType: string,
        data: Blob | Buffer
    ): Promise<IItemPayload<T>> {
        const pRet: IItemPayload<T> = {};
        const id = item._id;
        const sid = await this.saveAttachmentAsync(id, attName, mimeType, data);
        if (!sid) {
            return pRet;
        }
        this.datastore.clearItemById(sid, this._item.doctype);
        return this.selectItemAsync(sid);
    } //SaveAttachmentAsync
    public async removeItemAttachmentAsync(
        item: T,
        attName: string
    ): Promise<IItemPayload<T>> {
        const pRet: IItemPayload<T> = {};
        const id = item._id;
        const sid = await this.removeAttachmentAsync(id, attName);
        if (!sid) {
            return pRet;
        }
        this.datastore.clearItemById(sid, this._item.doctype);
        return this.selectItemAsync(sid);
    } //RemoveAttachmentAsync
    public async refreshItemsAsync(filter?:any): Promise<IItemPayload<T>> {
        const pRet: IItemPayload<T> = {
            dataoptions: [],
        };
        let xfilter : any = this.getItemsFilter();
        if (filter !== undefined && filter !== null) {
            xfilter = Object.assign({},xfilter,filter);
        }
        xfilter["doctype"] = this._item.doctype;
        const store = this.datastore;
        const n = await store.findDocsCountBySelectorAsync(filter);
        if (n < 1) {
            return pRet;
        }
        const dd = await this.getRefreshItems(0, n);
        if (dd === undefined || dd === null) {
            return pRet;
        }
        const nx = dd.length;
        if (nx < 1) {
            return pRet;
        }
        pRet.dataoptions = dd;
        return pRet;
    } //refreshEtudiantsAsync
}// class ItemSerices
