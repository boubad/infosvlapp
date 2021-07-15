import { DomainConstants } from "../domain/DomainConstants";
import type { IDataOption } from "../domain/IDataOption";
import type { IEtudAffectationDoc } from "../domain/IEtudAffectationDoc";
import type { IEtudiantDoc} from "../domain/IEtudiantDoc";
import { CreateEtudiant} from "../domain/IEtudiantDoc";
import { initialEtudiant } from "../domain/IEtudiantDoc";
import type { IEvtDoc } from "../domain/IEvtDoc";
import type { INoteDoc } from "../domain/INoteDoc";
import { StatusType } from "../domain/StatusType";
import type { IItemPayload } from "./IItemPayload";
import { ItemServices } from "./ItemServices";

export class EtudiantServices extends ItemServices<IEtudiantDoc> {
    constructor(baseurl?: string, databasename?: string) {
        super(initialEtudiant, baseurl, databasename);
    }
    //
    protected async fetchUniqueId(current: IEtudiantDoc): Promise<string | undefined> {
        const store = this.datastore;
        const ident = current.ident ? current.ident.trim() : "";
        if (ident.length > 0) {
            const filter: any = { docid: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_DOSSIER] = ident;
            let ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }// ident
        const username = current.username ? current.username.trim() : "";
        if (username.length > 0) {
            const filter: any = { docid: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_USERNAME] = username;
            let ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }// username
        const email = current.email ? current.email.trim() : "";
        if (email.length > 0) {
            const filter: any = { docid: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_EMAIL] = email;
            let ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }
        const phone = current.phone ? current.phone.trim() : "";
        if (phone.length > 0) {
            const filter: any = { docid: DomainConstants.TYPE_ETUDIANT };
            filter[DomainConstants.FIELD_PHONE] = phone;
            let ix = await store.findOneItemIdByFilter(filter);
            if (ix) {
                return ix;
            }
        }
        const firstname = current.firstname.trim();
        const lastname = current.lastname.trim().toUpperCase();
        const filter: any = { docid: DomainConstants.TYPE_ETUDIANT };
        filter[DomainConstants.FIELD_LASTNAME] = lastname;
        filter[DomainConstants.FIELD_FIRSTNAME] = firstname;
        let ix = await store.findOneItemIdByFilter(filter);
        if (ix) {
            return ix;
        }
        return undefined;
    }//fetchUniqueId
    //
    //
    protected isStoreable(p: IEtudiantDoc): boolean {
        return p.firstname.trim().length > 0 && p.lastname.trim().length > 0 && super.isStoreable(p);
    }// getPersistMap
    //
    protected getPersistMap(current: IEtudiantDoc): any {
        const data: any = {};
        const firstname = current.firstname.trim();
        const lastname = current.lastname.trim().toUpperCase();
        data[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_ETUDIANT;
        data[DomainConstants.FIELD_LASTNAME] = lastname;
        data[DomainConstants.FIELD_FIRSTNAME] = firstname;
        const ident = current.ident ? current.ident.trim() : "";
        if (ident.length > 0) {
            data[DomainConstants.FIELD_DOSSIER] = ident;
        }
        const username = current.username ? current.username.trim() : "";
        if (username.length > 0) {
            data[DomainConstants.FIELD_USERNAME] = username;
        }
        const email = current.email ? current.email.trim() : "";
        if (email.length > 0) {
            data[DomainConstants.FIELD_EMAIL] = email;
        }
        const phone = current.phone ? current.phone.trim() : "";
        if (phone.length > 0) {
            data[DomainConstants.FIELD_PHONE] = phone;
        }
        if (
            current.notedirty !== undefined &&
            current.notedirty !== null &&
            current.notedirty === true
        ) {
            data[DomainConstants.FIELD_NOTEDIRTY] = true;
        }
        if (
            current.evtdirty !== undefined &&
            current.evtdirty !== null &&
            current.evtdirty === true
        ) {
            data[DomainConstants.FIELD_EVTDIRTY] = true;
        }
        if (current.sup && current.sup.trim().length > 0) {
            data[DomainConstants.FIELD_ETUDESSUPERIEURES] = current.sup.trim();
        }
        if (current.typeformation && current.typeformation.trim().length > 0) {
            data[DomainConstants.FIELD_TYPEFORMATION] = current.typeformation.trim();
        }
        if (current.redoublant && current.redoublant.trim().length > 0) {
            data[DomainConstants.FIELD_REDOUBLANT] = current.redoublant.trim();
        }
        if (current.mentionbac && current.mentionbac.trim().length > 0) {
            data[DomainConstants.FIELD_MENTIONBAC] = current.mentionbac.trim();
        }
        if (current.optionbac && current.optionbac.trim().length > 0) {
            data[DomainConstants.FIELD_MENTIONBAC] = current.optionbac.trim();
        }
        if (current.seriebac && current.seriebac.trim().length > 0) {
            data[DomainConstants.FIELD_SERIEBAC] = current.seriebac.trim();
        }
        if (current.etablissement && current.etablissement.trim().length > 0) {
            data[DomainConstants.FIELD_ETABLISSEMENT] = current.etablissement.trim();
        }
        if (current.ville && current.ville.trim().length > 0) {
            data[DomainConstants.FIELD_VILLE] = current.ville.trim();
        }
        if (current.departement && current.departement.trim().length > 0) {
            data[DomainConstants.FIELD_DEPARTEMENT] = current.departement.trim();
        }
        if (current.birthyear && current.birthyear > 0) {
            data[DomainConstants.FIELD_BIRTHYEAR] = current.birthyear;
        }
        if (current.apb && current.apb > 0) {
            data[DomainConstants.FIELD_APB] = current.apb;
        }
        if (current.avatar && current.avatar.trim().length > 0) {
            data[DomainConstants.FIELD_AVATAR] = current.avatar.trim();
        }
        if (current.roles && current.roles.length > 0) {
            data[DomainConstants.FIELD_ROLES] = current.roles;
        }
        if (current.sexe && current.sexe.trim().length > 0) {
            data[DomainConstants.FIELD_SEXE] = current.sexe.trim();
        }
        if (current.birthdate && current.birthdate.trim().length > 0) {
            data[DomainConstants.FIELD_BIRTHDATE] = current.birthdate;
        }
        if (current.address && current.address.trim().length > 0) {
            data[DomainConstants.FIELD_ADDRESS] = current.address;
        }
        if (current.observations && current.observations.trim().length > 0) {
            data[DomainConstants.FIELD_OBSERVATIONS] = current.observations.trim();
        }
        if (current.reptype && current.reptype.trim().length > 0) {
            data[DomainConstants.FIELD_REPTYPE] = current.reptype.trim();
        }
        if (current.ownerid && current.ownerid.trim().length > 0) {
            data[DomainConstants.FIELD_OWNERID] = current.ownerid.trim();
        }
        if (
            current.status !== undefined &&
            current.status !== null &&
            current.status !== StatusType.Unknown
        ) {
            data[DomainConstants.FIELD_STATUS] = current.status;
        }
        if (current.data !== undefined && current.data !== null) {
            const pp: any = current.data;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_DATA] = rr;
            }
        } // data
        if (current.s0 !== undefined && current.s0 !== null) {
            const pp: any = current.s0;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S0] = rr;
            }
        } // s0
        if (current.s1 !== undefined && current.s1 !== null) {
            const pp: any = current.s1;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S1] = rr;
            }
        } // s1
        if (current.s2 !== undefined && current.s2 !== null) {
            const pp: any = current.s2;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S2] = rr;
            }
        } // s2
        if (current.s3 !== undefined && current.s3 !== null) {
            const pp: any = current.s3;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S3] = rr;
            }
        } // s3
        if (current.s4 !== undefined && current.s4 !== null) {
            const pp: any = current.s4;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S4] = rr;
            }
        } // s4
        if (current.s5 !== undefined && current.s5 !== null) {
            const pp: any = current.s5;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S5] = rr;
            }
        } // s5
        if (current.s6 !== undefined && current.s6 !== null) {
            const pp: any = current.s6;
            let bFound = false;
            const rr: any = {};
            for (const k in pp) {
                const v = pp[k];
                if (v !== undefined && v !== null) {
                    rr[k] = v;
                    bFound = true;
                }
            }
            if (bFound) {
                data[DomainConstants.FIELD_S6] = rr;
            }
        } // s6
        return data;
    }// getPersistMap
    //
    protected async getRefreshItems(_offset?: number, _count?: number): Promise<IDataOption[]> {
        let xfilter: any = this.getItemsFilter();
        xfilter[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_ETUDIANT;
        return this.datastore.getEtudiantsOptionsAsync(xfilter);
    }
    //
    public async selectItemAsync(id: string): Promise<IItemPayload<IEtudiantDoc>> {
        const pRet: IItemPayload<IEtudiantDoc> = {};
        const store = this.datastore;
        const p = await store.findEtudiantByIdAsync(id);
        if (p === undefined || p === null) {
            pRet.item = CreateEtudiant();
            return pRet;
        }
        if (p._loaded){
            pRet.item = p;
            return pRet;
        }
        const fields: string[] = [DomainConstants.FIELD_ID];
        const notes: INoteDoc[] = [];
        const evts: IEvtDoc[] = [];
        const affs: IEtudAffectationDoc[] = [];
        {
            const filter: any = { doctype: DomainConstants.TYPE_NOTE, etudiantid: p._id };
            const dd = await store.findAllDocsBySelectorAsync(filter, fields);
            if (dd !== undefined && dd !== null && dd.length > 0) {
                const n = dd.length;
                for (let i = 0; i < n; i++) {
                    const m = dd[i];
                    if (m._id) {
                        const id = "" + m._id;
                        const pz = await store.findNoteByIdAsync(id);
                        if (pz) {
                            notes.push(pz);
                        }
                    }
                } // i
            } // dd
            if (notes.length > 1) {
                notes.sort((a: INoteDoc, b: INoteDoc) => {
                    const s1: string = a._date ? a._date : "";
                    const s2: string = b._date ? b._date : "";
                    if (s1 < s2) {
                        return 1;
                    } else if (s1 > s2) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } // sort
            p._notes = notes;
        } // notes
        //
        {
            const filter: any = { doctype: DomainConstants.TYPE_EVT, etudiantid: p._id };
            const dd = await store.findAllDocsBySelectorAsync(filter, fields);
            if (dd !== undefined && dd !== null && dd.length > 0) {
                const n = dd.length;
                for (let i = 0; i < n; i++) {
                    const m = dd[i];
                    if (m._id) {
                        const id = "" + m._id;
                        const pz = await store.findEvtByIdAsync(id);
                        if (pz) {
                            evts.push(pz);
                        }
                    }
                } // i
            } // dd
            if (evts.length > 1) {
                evts.sort((a: INoteDoc, b: INoteDoc) => {
                    const s1: string = a._date ? a._date : "";
                    const s2: string = b._date ? b._date : "";
                    if (s1 < s2) {
                        return 1;
                    } else if (s1 > s2) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } // sort
            p._evts = evts;
        } // evts
        //
        {
            const filter: any = { doctype: DomainConstants.TYPE_ETUDAFFECTATION, etudiantid: p._id };
            const dd = await store.findAllDocsBySelectorAsync(filter, fields);
            if (dd !== undefined && dd !== null && dd.length > 0) {
                const n = dd.length;
                for (let i = 0; i < n; i++) {
                    const m = dd[i];
                    if (m._id) {
                        const id = "" + m._id;
                        const pz = await store.findEtudAffectationByIdAsync(id);
                        if (pz) {
                            affs.push(pz);
                        }
                    }
                } // i
            } // dd
            if (affs.length > 1) {
                affs.sort((a: IEtudAffectationDoc, b: IEtudAffectationDoc) => {
                    const s1: string = a.startdate ? a.startdate : "";
                    const s2: string = b.startdate ? b.startdate : "";
                    if (s1 < s2) {
                        return 1;
                    } else if (s1 > s2) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } // sort
            p._affectations = affs;
        } // affectations
        //
        p._loaded = true;
        store.register_item(p);
        pRet.item = p;
        return pRet;
    } // SelectItemAsyn
    public async refreshItemsAsync(filter?:any): Promise<IItemPayload<IEtudiantDoc>> {
        const pRet: IItemPayload<IEtudiantDoc> = {
            dataoptions: await this.getRefreshItems(),
        };
        return pRet;
    } //refreshEtudiantsAsync
    public async setEtudiantAvatarAsync(
        etudiantid: string,
        attName: string,
        mimeType: string,
        data: Blob
    ): Promise<IItemPayload<IEtudiantDoc>> {
        const pRet: IItemPayload<IEtudiantDoc> = {};
        const store = this.datastore;
        const pEtud = await store.findEtudiantByIdAsync(etudiantid);
        if (!pEtud) {
            return pRet;
        }
        const id = pEtud._id;
        const sid = await store.maintainsBlobAsync(id, attName, mimeType, data);
        if (sid.length < 1) {
            return pRet;
        }
        const oMap = await store.findDocByIdAsync(id);
        if (oMap === undefined || oMap === null) {
            return pRet;
        }
        oMap[DomainConstants.FIELD_AVATAR] = attName;
        const sRet = await store.maintainsDocAsync(oMap);
        if (sRet.length > 0) {
            store.clearItemById(DomainConstants.TYPE_ETUDIANT, id);
            return await this.selectItemAsync(id);
        }
        return pRet;
    } //setEtudiantAvatar
    public async removeItemAsync(p: IEtudiantDoc): Promise<boolean> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return false;
        }
        const store = this.datastore;
        await store.removeDocsBySelectorAsync({etudiantid: id
        });
        return super.removeItemAsync(p);
    }//removeItemAsync
} // class EtudiantServices
