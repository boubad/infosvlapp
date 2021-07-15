// DataStoreFactory.ts
//
import type { IDataStore } from '../IDataStore';
import { CouchDBDataStore } from './CouchDBDataStore';
import { DBConstants } from './DBConstants';

//
const STRING_SLASH = '/';
//
export class DataStoreFactory {
    public static GetDataStore(baseurl?: string, databasename?: string, username?: string, password?: string): IDataStore {
        let surl = DBConstants.GetDefaultHost();
        let sdb = DBConstants.GetDefaultDatabase();
        const s1 = (baseurl === undefined) || (baseurl === null) ? "" : baseurl.trim();
        if (s1.length > 0) {
            surl = s1;
        }
        const s2 = (databasename === undefined || databasename === null) ? "" : databasename.trim();
        if (s2.length > 0) {
            sdb = s2;
        }
        const n = surl.length;
        if (surl[n - 1] !== STRING_SLASH) {
            surl = surl + STRING_SLASH;
        }
        surl = surl + sdb + STRING_SLASH;
        return new CouchDBDataStore(surl, username, password);
    } // GetCouchDBStore
} // class CouchDBServicesStoreFactory
