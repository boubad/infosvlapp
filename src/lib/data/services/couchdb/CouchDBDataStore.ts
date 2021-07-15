import type { IDataStore } from "../IDataStore";
import { DBConstants } from "./DBConstants";
import { FetchClient } from "./FetchClient";
import type { ICouchDBUpdateResponse } from "./ICouchDBUpdateResponse";
//
//
const STRING_ETAG1 = "etag";
const STRING_ETAG2 = "ETag";
const STRING_FIND_IMPL = "_find";
//const STRING_BULK_DOCS = "_bulk_docs";
const STRING_BULK_GET = "_bulk_get";
//
const STRING_SLASH = "/";
const STRING_EMPTY = "";
const STRING_ID = "_id";
const STRING_UNDER = "_";
const STRING_ARG_REV = "?rev=";
//
const MAX_INT_VALUE = Number.MAX_SAFE_INTEGER;
//
export class CouchDBDataStore implements IDataStore {
  private readonly _baseurl: string;
  private readonly _client: FetchClient;
  //
  constructor(dbUrl?: string,username?:string, password?:string ) {
    this._client = new FetchClient(username,password);
    this._baseurl =
      dbUrl !== undefined && dbUrl !== null && dbUrl.trim().length > 0
        ? dbUrl
        : DBConstants.GetUrl();
    const n = this._baseurl.length;
    if (this._baseurl[n - 1] !== STRING_SLASH) {
      this._baseurl += STRING_SLASH;
    }
  } // constructor
  public async synchroDataAsync(): Promise<void> {
    return;
  } // synchroData
  public async isOnLineAsync(): Promise<boolean> {
    let s = this._baseurl;
    if (s.endsWith("/")) {
      s = s.substring(0, s.length - 1);
    }
    const n = s.lastIndexOf("/");
    if (n > 0) {
      s = s.substring(0, n);
    }
    const p = await this._client.getAsync(s);
    if (p !== undefined && p !== null) {
      return p.couchdb !== undefined && p.couchdb !== null;
    }
    return false;
  }
  public formBlobUrl(docid?: string, attname?: string): string {
    if (
      docid &&
      docid.trim().length > 0 &&
      attname &&
      attname.trim().length > 0
    ) {
      return (
        this._baseurl +
        encodeURI(docid.trim()) +
        STRING_SLASH +
        encodeURI(attname.trim())
      );
    } else {
      return STRING_EMPTY;
    }
  } // formBlobUrl
  public async getBlobDataAsync(
    id: string,
    name: string
  ): Promise<ArrayBuffer | undefined> {
    const url = this.formBlobUrl(id, name);
    if (url.length < 1) {
      return undefined;
    }
    return this._client.getBlobDataAsync(url);
  } //GetBlobDataAsync

  public async findDocByIdAsync(sid: string): Promise<any | undefined> {
    const url = this._formUrl(sid) + "?attachments=true";
    return this._client.getAsync(url);
  } // findDocById
  public async findDocRevisionAsync(sid: string): Promise<string | undefined> {
    const hh: Headers | undefined = await this._client.headAsync(
      this._formUrl(sid)
    );
    if (!hh) {
      return undefined;
    }
    let sx = STRING_EMPTY;
    if (hh.has(STRING_ETAG1)) {
      const s = hh.get(STRING_ETAG1);
      sx = s ? s : STRING_EMPTY;
    } else if (hh.has(STRING_ETAG2)) {
      const s_1 = hh.get(STRING_ETAG2);
      sx = s_1 ? s_1 : STRING_EMPTY;
    }
    const n = sx.length;
    if (n > 2) {
      sx = sx.slice(1, n - 1);
    }
    return sx;
  } // findDocRevision
  public async maintainsDocAsync(ddoc: any): Promise<string | undefined> {
    const doc: any = {};
    let id: string = "";
    for (const key in ddoc) {
      const x = ddoc[key];
      if (x !== undefined && x !== null) {
        if (key === STRING_ID) {
          id = (x as string).trim();
        } else if (!key.startsWith(STRING_UNDER)) {
          doc[key] = x;
        }
      } // value
    } // key
    if (id.length < 1) {
      const rsp = await this._createDocAsync(doc);
      if (rsp && rsp.id) {
        return rsp.id;
      }
      return undefined;
    } // id is empty
    doc._id = id;
    const old = await this.findDocByIdAsync(id);
    if (old) {
      let rev: string = "";
      if (old._rev) {
        rev = old._rev as string;
      }
      if (old._attachments) {
        doc._attachments = old._attachments;
      }
      if (rev.length > 0) {
        const sUrl = this._formDocUrl(doc._id, rev);
        const rsp = await this._client.putAsync(sUrl, doc);
        if (rsp && rsp.id) {
          return rsp.id;
        }
        return undefined;
      }
    } // old
    const rsp = await this._createDocAsync(doc);
    if (rsp && rsp.id) {
      return rsp.id;
    }
    return undefined;
  } // maintainsDoc
  public async removeDocAsync(id: string): Promise<boolean> {
    const srev = await this.findDocRevisionAsync(id);
    if (!srev) {
      return false;
    }
    if (srev.length < 1) {
      return false;
    } else {
      const sUrl = this._formDocUrl(id, srev);
      const x = await this._client.deleteAsync(sUrl);
      if (!x) {
        return false;
      }
    }
    return true;
  } // deleteDoc
  public async maintainsBlobAsync(
    sid: string,
    attname: string,
    attype: string,
    bdata: Blob | Buffer
  ): Promise<string | undefined> {
    const srev = await this.findDocRevisionAsync(sid);
    if (!srev) {
      return undefined;
    }
    if (srev.length < 1) {
      return undefined;
    } else {
      const url = this.formBlobUrl(sid, attname) + "?rev=" + srev;
      const rsp = await this._client.putBlobAsync(url, attype, bdata);
      if (rsp && rsp.id) {
        return this.formBlobUrl(rsp.id, attname);
      }
    }
    return undefined;
  } // maintainsBlob
  public async removeBlobAsync(sid: string, attname: string): Promise<boolean> {
    const srev = await this.findDocRevisionAsync(sid);
    if (!srev) {
      return false;
    }
    if (srev.length < 1) {
      return false;
    }
    const url = this._formAttachmentUrl(sid, attname, srev);
    const x = this._client.deleteAsync(url);
    if (!x) {
      return false;
    }
    return true;
  } // removeBlob
  public async findDocsBySelectorAsync(
    sel: any,
    start?: number,
    count?: number,
    fields?: string[],
    sort?: any[]
  ): Promise<any[]> {
    if (count === undefined || count === null) {
      count = 20;
    }
    if (count < 1) {
      count = 1;
    }
    const sUrl = this._formUrl(STRING_FIND_IMPL);
    const opts: any = {
      limit: count,
      selector: sel,
      skip: start && start >= 0 ? start : 0,
    };
    if (fields && fields.length > 0) {
      opts.fields = fields;
    }
    if (sort !== undefined && sort !== null && sort.length > 0) {
      opts.sort = sort;
    }
    const rsp = await this._client.postAsync(sUrl, opts);
    if (rsp && rsp.docs) {
      return rsp.docs;
    }
    return [];
  } // findDocsBySelector
  public async findDocBySelectorAsync(sel: any,fields?: string[]): Promise<any | undefined> {
    const mm = await this.findDocsBySelectorAsync(sel, 0, 1,fields);
    if (!mm) {
      return undefined;
    }
    if (mm.length < 1) {
      return undefined;
    }
    return mm[0];
  }
  public async findAllDocsBySelectorAsync(
    sel: any,
    fields?: string[],
    sort?: any[]
  ): Promise<any[]> {
    const sUrl = this._formUrl(STRING_FIND_IMPL);
    const opts: any = {
      limit: MAX_INT_VALUE,
      selector: sel,
      skip: 0,
    };
    if (fields && fields.length > 0) {
      opts.fields = fields;
    }
    if (sort !== undefined && sort !== null && sort.length > 0) {
      opts.sort = sort;
    }
    const rsp = await this._client.postAsync(sUrl, opts);
    if (rsp && rsp.docs) {
      return rsp.docs;
    }
    return [];
  } // findAllDocsBySelector
  public async findAllDocsIdsBySelectorAsync(
    sel: any,
  ): Promise<string[]> {
    const fields: string[] = ["_id"];
    const vRet: string[] = [];
    const pp = await this.findAllDocsBySelectorAsync(sel, fields);
    if (pp) {
      const n = pp.length;
      for (let i = 0; i < n; i++) {
        const x = pp[i];
        if (x._id) {
          vRet.push(x._id);
        }
      }// i
    }// pp
    return vRet;
  }//findAllDocsIdsBySelectorAsync
  public async findDocsCountBySelectorAsync(sel: any): Promise<number> {
    const offset = 0;
    const count = MAX_INT_VALUE;
    const fields = [STRING_ID];
    const docs = await this.findDocsBySelectorAsync(sel, offset, count, fields);
    if (docs) {
      return docs.length;
    } else {
      return 0;
    }
  } // findDocsCountBySelector
  public async maintainsManyDocsAsync(docs: any[]): Promise<void> {
    if (docs !== undefined && docs !== null && docs.length > 0) {
      const n = docs.length;
      for (let i = 0; i < n; i++) {
        const aa = docs[i];
        await this.maintainsDocAsync(aa);
      } // i
    }
  } //  maintainsManyDocs
  public async bulkGetAsync(ids: string[]): Promise<any[]> {
    const n = ids.length;
    const vdocs: any[] = [];
    for (let i = 0; i < n; i++) {
      const id = ids[i];
      vdocs.push({ id });
    } // i
    const sUrl = this._formUrl(STRING_BULK_GET);
    const rsp = await this._client.postAsync(sUrl, { docs: vdocs });
    const pRet: any[] = [];
    if (rsp && rsp.results) {
      const rr = rsp.results;
      const nx = rr.length;
      for (let i_1 = 0; i_1 < nx; i_1++) {
        const x = rr[i_1];
        if (x.docs) {
          const yy = x.docs;
          const ny = yy.length;
          for (let j = 0; j < ny; j++) {
            const y = yy[j];
            if (y.ok) {
              pRet.push(y.ok);
            } // ok
          } // j
        } // xdocs
      } // i
    } // rsp.results
    return pRet;
  } // bulkGet
  public async removeDocsBySelectorAsync(sel: any): Promise<boolean> {
    const offset = 0;
    const count = MAX_INT_VALUE;
    const fields = [STRING_ID];
    const docs = await this.findDocsBySelectorAsync(sel, offset, count, fields);
    if (!docs) {
      return false;
    }
    const n = docs.length;
    if (n < 1) {
      return true;
    }
    for (let i = 0; i < n; i++) {
      const x = docs[i];
      if (x._id) {
        const id = "" + x._id;
        await this.removeDocAsync(id);
      }
    } // i
    return true;
  } // removeDocsBySelector
  private _formUrl(uri: string): string {
    return this._baseurl + encodeURI(uri);
  } // formUrl
  private _formDocUrl(id: string, rev: string): string {
    return this._baseurl + encodeURI(id) + STRING_ARG_REV + rev;
  } // formDocUrl
  private _formAttachmentUrl(id: string, attname: string, rev: string): string {
    return (
      this._baseurl +
      encodeURI(id) +
      STRING_SLASH +
      encodeURI(attname) +
      STRING_ARG_REV +
      rev
    );
  } // formAttachmentUrl
  private async _createDocAsync(doc: any): Promise<ICouchDBUpdateResponse | undefined> {
    let sUrl = this._baseurl;
    if (doc._id && doc._id.trim().length > 0) {
      sUrl = this._baseurl + encodeURI(doc._id.trim());
      return this._client.putAsync(sUrl, doc);
    }
    if (doc._id) {
      delete doc._id;
    }
    return this._client.postAsync(sUrl, doc);
  } // createDoc
} // class CouchDBDataStore
