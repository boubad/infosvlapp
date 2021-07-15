import { STRING_ASC } from "../DataConstants";
import { DomainConstants } from "../domain/DomainConstants";
import { GroupeType } from "../domain/GroupeType";
import { CreateAffectation, IAffectationDoc, initialAffectation } from "../domain/IAffectationDoc";
import { IAnneeDoc, initialAnnee } from "../domain/IAnneeDoc";
import type { IAttachedDoc } from "../domain/IAttachedDoc";
import type { IBaseDoc } from "../domain/IBaseDoc";
import type { IControleChildDoc } from "../domain/IControleChildDoc";
import { IControleDoc, initialControle } from "../domain/IControleDoc";
import type { IDataOption } from "../domain/IDataOption";
import { IEtudAffectationDoc, initialEtudAffectation } from "../domain/IEtudAffectationDoc";
import { IEtudiantDoc, initialEtudiant } from "../domain/IEtudiantDoc";
import { IEvtDoc, initialEvt } from "../domain/IEvtDoc";
import { IGroupeControlesDoc, initialGroupeControles } from "../domain/IGroupeControlesDoc";
import { IGroupeDoc, initialGroupe } from "../domain/IGroupeDoc";
import { IMatiereDoc, initialMatiere } from "../domain/IMatiereDoc";
import { initialNote, INoteDoc } from "../domain/INoteDoc";
import type { IPersonDoc } from "../domain/IPersonDoc";
import { initialSemestre, ISemestreDoc } from "../domain/ISemestreDoc";
import type { ISigleNamedDoc } from "../domain/ISigleNamedDoc";
import { initialUnite, IUniteDoc } from "../domain/IUniteDoc";
import { SortOptionsFunc } from "../domain/SortOptionsFunc";
import { ConvertData } from "./ConvertData";
import { DataStoreFactory } from "./couchdb/DataStoreFactory";
import type { IDataStore } from "./IDataStore";
//
const STRING_IMAGE = "image/";
const MIME_IMAGE_JPEG = "image/jpeg";
//
export class InfoDataStore implements IDataStore {
    //
    private readonly _datastore: IDataStore;
    private _data: Map<string, Map<string, IBaseDoc>> = new Map<
        string,
        Map<string, IBaseDoc>
    >();
    private _photos: Map<string, string> = new Map<string, string>();
    //
    constructor(baseurl?: string, databasename?: string, username?: string, password?: string) {
        this._datastore = DataStoreFactory.GetDataStore(baseurl, databasename, username, password);
    }
    public get dataStore(): IDataStore {
        return this._datastore;
    }

    //
    public async checkAttachmentsAsync(p: IBaseDoc): Promise<void> {
        const pp = p._attachments ? p._attachments : [];
        const n = pp.length;
        for (let i = 0; i < n; i++) {
            await this.checkAttachedDocUrl(pp[i]);
        } // i
    }
    //
    public async checkAttachedDocUrl(p: IAttachedDoc): Promise<void> {
        if (!p) {
            return;
        }
        if (p.url !== undefined && p.url !== null && p.url.length > 0) {
            return;
        }
        const id = p.docid ? p.docid.trim() : "";
        const name = p.name ? p.name.trim() : "";
        const mimetype = p.content_type.trim();
        if (id.length < 1 || name.length < 1 || mimetype.length < 1) {
            return;
        }
        p.url = await this.getBlobDataUrlAsync(id, name, mimetype);
    } //CheckAttachedDocUrl
    //
    public async getBlobDataUrlAsync(
        id: string,
        name: string,
        mimetype?: string
    ): Promise<string> {
        const data = await this.dataStore.getBlobDataAsync(id, name);
        if (!data) {
            return "";
        }
        if (mimetype === undefined || mimetype === null) {
            mimetype = MIME_IMAGE_JPEG;
        }
        const blob = new Blob([data], { type: mimetype });
        const urlCreator = window.URL || window.webkitURL;
        const sret = urlCreator.createObjectURL(blob);
        return sret;
    } // GetBlobDataUrl
    //
    public async findOneItemIdByFilter(filter: any): Promise<string | undefined> {
        const fields: string[] = [DomainConstants.FIELD_ID];
        const mm = await this._datastore.findDocsBySelectorAsync(
            filter,
            0,
            1,
            fields
        );
        if (!mm) {
            return undefined;
        }
        if (mm.length < 1) {
            return undefined;
        }
        const m = mm[0];
        if (!m) {
            return undefined;
        }
        const v = m[DomainConstants.FIELD_ID];
        if (!v) {
            return undefined;
        }
        return "" + v;
    } // Promise<any>
    //
    public async getPersonsOptionsByFilterAsync(
        sel: any
    ): Promise<IDataOption[]> {
        const pRet: IDataOption[] = [];
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_FIRSTNAME,
            DomainConstants.FIELD_LASTNAME,
            DomainConstants.FIELD_AVATAR,
            DomainConstants.FIELD_ATTACHMENTS,
        ];
        const sort: any[] = [{ lastname: "asc" }, { firstname: "asc" }];
        const dd = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields,
            sort
        );
        const n = dd.length;
        if (n < 1) {
            return [];
        }
        for (let i = 0; i < n; i++) {
            const v = dd[i];
            if (v && v._id && v.lastname && v.firstname) {
                const id = v._id as string;
                const lastname = (v.lastname as string).toUpperCase();
                const firstname = v.firstname as string;
                const title = lastname + " " + firstname;
                const avatar =
                    lastname.substr(0, 1).toUpperCase() +
                    firstname.substr(0, 1).toUpperCase();
                const p: IDataOption = {
                    value: id,
                    name: title,
                    avatar,
                };
                await this.checkOptionAvatarAsync(id, v._attachments, v.avatar, p);
                pRet.push(p);
            }
        } // i
        return pRet;
    } //GetPersonsOptionsByFilterAsync
    //
    public async getItemOptionsAsync<T extends ISigleNamedDoc>(
        item: T
    ): Promise<IDataOption[]> {
        const sel: any = { doctype: item.doctype };
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_NAME,
            DomainConstants.FIELD_SIGLE,
            DomainConstants.FIELD_OBSERVATIONS,
        ];
        const pp: any[] = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields
        );
        const pz: IDataOption[] = [];
        if (pp !== undefined && pp !== null && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const v: any = pp[i];
                if (v._id && v.sigle && v.name) {
                    const id = v._id as string;
                    const sigle = v.sigle as string;
                    const title = v.name as string;
                    const rem = v.observations ? v.observations : "";
                    let subTitle = sigle + " " + rem;
                    pz.push({ value: id, name: title, subTitle });
                }
            } // i
            if (pz.length > 1) {
                pz.sort(SortOptionsFunc);
            }
        } // pp
        if (pz.length < 1) {
            return pz;
        }
        const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
        const nx = pz.length;
        for (let i = 0; i < nx; i++) {
            pRet.push(pz[i]);
        } // i
        return pRet;
    } // GetItemOptionsAsync
    //
    public async getSemestresOptionsAsync(): Promise<IDataOption[]> {
        return this.getItemOptionsAsync<ISemestreDoc>(initialSemestre);
    } // GetSemestresOptionsAsync
    public async getGroupesOptionsAsync(
        semestreid?: string
    ): Promise<IDataOption[]> {
        const pz: IDataOption[] = [];
        if (semestreid === undefined || semestreid === null) {
            return pz;
        }
        const id = semestreid.trim();
        if (id.length < 1) {
            return pz;
        }
        const sel: any = { doctype: DomainConstants.TYPE_GROUPE };
        sel[DomainConstants.FIELD_SEMESTREID] = semestreid;
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_NAME,
            DomainConstants.FIELD_OBSERVATIONS,
            DomainConstants.FIELD_GROUPETYPE,
            DomainConstants.FIELD_SIGLE,
        ];
        const pp: any[] = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields
        );
        if (pp !== undefined && pp !== null && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const v: any = pp[i];
                if (v.groupetype !== undefined && v.groupetype !== null) {
                    const x = v.groupetype as GroupeType;
                    if (x === GroupeType.Promotion || x == GroupeType.Td) {
                        continue;
                    }
                }
                if (v._id && v.sigle && v.name) {
                    const id = v._id as string;
                    const sigle = v.sigle as string;
                    const title = v.name as string;
                    const rem = v.observations ? v.observations : "";
                    let subTitle = sigle + " " + rem;
                    pz.push({ value: id, name: title, subTitle, supData: v.semestreid });
                }
            } // i
            if (pz.length > 1) {
                pz.sort(SortOptionsFunc);
            }
        } // pp
        if (pz.length < 1) {
            return pz;
        }
        const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
        const nx = pz.length;
        for (let i = 0; i < nx; i++) {
            pRet.push(pz[i]);
        } // i
        return pRet;
    } // get_groupe_options
    public async getUnitesOptionsAsync(): Promise<IDataOption[]> {
        return this.getItemOptionsAsync<IUniteDoc>(initialUnite);
    } // GetSemestresOptionsAsync
    public async getMatieresOptionsAsync(
        uniteid?: string
    ): Promise<IDataOption[]> {
        const pz: IDataOption[] = [];
        if (uniteid === undefined || uniteid === null) {
            return pz;
        }
        if (uniteid.length < 1) {
            return pz;
        }
        const sel: any = { doctype: DomainConstants.TYPE_MATIERE, uniteid: uniteid };
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_NAME,
            DomainConstants.FIELD_OBSERVATIONS,
            DomainConstants.FIELD_SIGLE,
        ];
        const pp: any[] = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields
        );

        if (pp !== undefined && pp !== null && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const v: any = pp[i];
                if (v._id && v.sigle && v.name) {
                    const id = v._id as string;
                    const sigle = v.sigle as string;
                    const title = v.name as string;
                    const rem = v.observations ? v.observations : "";
                    let subTitle = sigle + " " + rem;
                    pz.push({ value: id, name: title, subTitle, supData: uniteid });
                }
            } // i
            if (pz.length > 1) {
                pz.sort(SortOptionsFunc);
            }
        } // pp
        if (pz.length < 1) {
            return pz;
        }
        const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
        const nx = pz.length;
        for (let i = 0; i < nx; i++) {
            pRet.push(pz[i]);
        } // i
        return pRet;
    } // GetMatieresOptionsAsync
    //
    public async getAnneesOptionsAsync(): Promise<IDataOption[]> {
        const sel: any = { doctype: DomainConstants.TYPE_ANNEE };
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_SIGLE,
            DomainConstants.FIELD_NAME,
            DomainConstants.FIELD_STARTDATE,
        ];
        const pp: any[] = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields
        );
        const pz: IDataOption[] = [];
        if (pp !== undefined && pp !== null && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const v: any = pp[i];
                if (v._id && v.sigle && v.name) {
                    const id = v._id as string;
                    const sigle = v.sigle as string;
                    const title = v.name as string;
                    const rem = v.observations ? v.observations : "";
                    let subTitle = sigle + " " + rem;
                    pz.push({
                        value: id,
                        name: title,
                        subTitle,
                        supData: v.startdate ? v.startdate : "",
                    });
                }
            } // i
            if (pz.length > 1) {
                pz.sort((a, b) => {
                    const s1 = a.supData ? a.supData : "";
                    const s2 = b.supData ? b.supData : "";
                    if (s1 > s2) {
                        return -1;
                    } else if (s2 < s1) {
                        return 1;
                    }
                    return 0;
                });
            }
        } // pp
        if (pz.length < 1) {
            return pz;
        }
        const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
        const nx = pz.length;
        for (let i = 0; i < nx; i++) {
            pRet.push(pz[i]);
        } // i
        return pRet;
    } // GetAnneesOptionsAsync
    public async getGroupeControlesOptionsAsync(semestreid: string, matiereid: string): Promise<IDataOption[]> {
        const sel: any = { doctype: DomainConstants.TYPE_GROUPCONTROLE, semestreid, matiereid };
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_NAME,
            DomainConstants.FIELD_SIGLE,
            DomainConstants.FIELD_OBSERVATIONS,
        ];
        const pp: any[] = await this.dataStore.findAllDocsBySelectorAsync(
            sel,
            fields
        );
        const pz: IDataOption[] = [];
        if (pp !== undefined && pp !== null && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const v: any = pp[i];
                if (v._id) {
                    const value = v._id as string;
                    const subTitle = (v.name) ? v.name : "";
                    const name = (v.sigle) ? v.sigle : "";
                    const subText = v.observations ? v.observations : "";
                    pz.push({ value, name, subTitle, subText });
                }
            } // i
            if (pz.length > 1) {
                pz.sort(SortOptionsFunc);
            }
        } // pp
        if (pz.length < 1) {
            return pz;
        }
        const pRet: IDataOption[] = [{ value: "", name: "Aucune sélection" }];
        const nx = pz.length;
        for (let i = 0; i < nx; i++) {
            pRet.push(pz[i]);
        } // i
        return pRet;
    } // getGroupeControlesOptionsAsync
    //
    public getPhotoUrl(docid: string): string | undefined {
        return this._photos.get(docid);
    }
    public unRegisterPhoto(docid: string, url: string) {
        if (!docid || !url) {
            return;
        }
        const p = this._photos.get(docid);
        if (p) {
            this._photos.delete(docid);
        }
    } // unRegisterPhoto
    public registerPhoto(docid: string, url: string) {
        if (!docid || !url) {
            return;
        }
        this._photos.set(docid, url);
    } // registerPhoto
    //
    public clearItemById(id: string, doctype: string) {
        if (!id || !doctype) {
            return;
        }
        if (doctype === DomainConstants.TYPE_ETUDIANT) {
            const x = this._photos.get(id);
            if (x) {
                this._photos.delete(id);
            }
        }
        const m = this._data.get(doctype);
        if (!m) {
            return;
        }
        let pRet = m.get(id);
        if (pRet) {
            m.delete(id);
        }
    } // _clearItemById
    //
    public async getItemsAsync<T extends IBaseDoc>(
        item: T,
        skip: number,
        limit: number,
        sel?: any
    ): Promise<T[]> {
        const doctype = item.doctype;
        if (doctype.length < 1) {
            return [];
        }
        const filter: any = sel ? sel : {};
        filter.doctype = doctype;
        const pp = await this.dataStore.findDocsBySelectorAsync(
            filter,
            skip,
            limit
        );
        const pRet: any[] = [];
        if (pp && pp.length > 0) {
            const n = pp.length;
            for (let i = 0; i < n; i++) {
                const x = pp[i];
                const v = await this._convertDataAsync(item, x);
                if (v) {
                    pRet.push(v);
                    this.clearItemById(v._id, v.doctype);
                }
            } // i
        } // pp
        return pRet;
    } //  GetItemsAsync
    //
    public async getItemsCountAsync<T extends IBaseDoc>(
        item: T,
        sel?: any
    ): Promise<number> {
        const doctype = item.doctype;
        if (doctype.length < 1) {
            return 0;
        }
        const filter: any = sel ? sel : {};
        filter.doctype = doctype;
        const n = await this.dataStore.findDocsCountBySelectorAsync(filter);
        return n;
    } // GetItemsCountAsync
    //
    public async findItemByIdAsync<T extends IBaseDoc>(item: T, id: string): Promise<T | undefined> {
        const doctype = item.doctype;
        if (doctype === DomainConstants.TYPE_NOTE) {
            const p = await this.findNoteByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_EVT) {
            const p = await this.findEvtByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_AFFECTATION) {
            const p = await this.findAffectationByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ETUDAFFECTATION) {
            const p = await this.findEtudAffectationByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_CONTROLE) {
            const p = await this.findControleByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ETUDIANT) {
            const p = await this.findEtudiantByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_MATIERE) {
            const p = await this.findMatiereByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_GROUPE) {
            const p = await this.findGroupeByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_ANNEE) {
            const p = await this.findAnneeByIdAsync(id) as any;
            return p as T;
        }
        else if (doctype === DomainConstants.TYPE_SEMESTRE) {
            const p = await this.findAnneeByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_UNITE) {
            const p = await this.findUniteByIdAsync(id) as any;
            return p as T;
        } else if (doctype === DomainConstants.TYPE_GROUPCONTROLE) {
            const p = await this.findGroupeControlesByIdAsync(id) as any;
            return p as T;
        }
        return undefined;
    }//findItemByIdAsync
    //
    public async findAnneeByIdAsync(id: string): Promise<IAnneeDoc | undefined> {
        return this._internal_find_item_by_id_async(initialAnnee, id);
    } // findAnneeByIdAsync
    public async findSemestreByIdAsync(
        id: string
    ): Promise<ISemestreDoc | undefined> {
        return this._internal_find_item_by_id_async(initialSemestre, id);
    } // findSemestreByIdAsync
    public async findGroupeByIdAsync(
        id: string
    ): Promise<IGroupeDoc | undefined> {
        let p = this._internal_find_item(initialGroupe, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialGroupe, id);
        if (!p) {
            return undefined;
        }
        if (p.parentid.trim().length > 0) {
            const px = await this.findGroupeByIdAsync(p.parentid);
            if (px) {
                p._parentSigle = px.sigle;
            }
        }// parent
        this.register_item(p);
        return p;
    } // findGroupeByIdAsync
    public async getGroupeChildrenAsync(groupeid: string): Promise<IGroupeDoc[]> {
        const pRet: IGroupeDoc[] = [];
        const p = await this.findGroupeByIdAsync(groupeid);
        if (!p) {
            return pRet;
        }
        const filter: any = { doctype: DomainConstants.TYPE_GROUPE, parentid: groupeid };
        const dd = await this.dataStore.findAllDocsBySelectorAsync(filter, [DomainConstants.FIELD_ID]);
        if (dd && dd.length > 0) {
            const n = dd.length;
            for (let i = 0; i < n; i++) {
                const d = dd[i];
                if (d._id) {
                    const sid = "" + d._id;
                    const x = await this.findGroupeByIdAsync(sid);
                    if (x) {
                        pRet.push(x);
                    }
                }
            }// i
        }// dd
        if (pRet.length > 1) {
            pRet.sort((a, b) => {
                if (a.sigle < b.sigle) {
                    return -1;
                } else if (a.sigle > b.sigle) {
                    return 1;
                }
                return 0;
            });
        }// sort
        return pRet;
    }// getGroupeChildrenAsync
    public async getGroupeAllTpsAsync(groupeid: string): Promise<IGroupeDoc[]> {
        const pRet: IGroupeDoc[] = [];
        const gg = await this.getGroupeChildrenAsync(groupeid);
        const n = gg.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                const g = gg[i];
                if (g.groupetype == GroupeType.Tp) {
                    pRet.push(g);
                } else {
                    const xx = await this.getGroupeAllTpsAsync(g._id);
                    const m = xx.length;
                    if (m < 1) {
                        pRet.push(g);
                    } else {
                        for (let j = 0; j < m; j++) {
                            pRet.push(xx[j]);
                        }
                    }
                }
            }// i
        }// n
        if (pRet.length > 1) {
            pRet.sort((a, b) => {
                if (a.sigle < b.sigle) {
                    return -1;
                } else if (a.sigle > b.sigle) {
                    return 1;
                }
                return 0;
            });
        }// sort
        return pRet;
    }// getGroupeAllTpsAsync
    public async findUniteByIdAsync(id: string): Promise<IUniteDoc | undefined> {
        return this._internal_find_item_by_id_async(initialUnite, id);
    } // findAnneeByIdAsync
    public async findMatiereByIdAsync(
        id: string
    ): Promise<IMatiereDoc | undefined> {
        let p = this._internal_find_item(initialMatiere, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialMatiere, id);
        if (!p) {
            return undefined;
        }
        const unite = await this.findUniteByIdAsync(p.uniteid);
        if (unite) {
            p._uniteSigle = unite.sigle;
        }
        this.register_item(p);
        return p;
    } // findMatiereByIdAsync
    public async findEtudiantByIdAsync(
        id: string
    ): Promise<IEtudiantDoc | undefined> {
        let p = this._internal_find_item(initialEtudiant, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialEtudiant, id);
        if (!p) {
            return undefined;
        }
        p._fullname = p.lastname + " " + p.firstname;
        p._avatar =
            p.lastname.substring(0, 1).toUpperCase() +
            p.firstname.substring(0, 1).toUpperCase();
        if (p._url !== undefined && p._url !== null && p._url.length > 0) {
            this.registerPhoto(p._id, p._url);
        }
        await this._check_person_avatar_async(p);
        this.register_item(p);
        return p;
    } // findEtudiantByIdAsync
    public async findAffectationByIdAsync(
        id: string,
        p?: IAffectationDoc
    ): Promise<IAffectationDoc | undefined> {
        let px: IAffectationDoc = CreateAffectation();
        if (p === undefined || p === null) {
            let p = this._internal_find_item(initialAffectation, id);
            if (p) {
                return p;
            }
            p = await this.loadItemByIdAsync(initialAffectation, id);
            if (!p) {
                return undefined;
            }
            px = p;
        } else {
            px = p;
        }
        const annee = await this.findAnneeByIdAsync(px.anneeid);
        if (annee) {
            px._anneeSigle = annee.sigle;
            px.startdate = annee.startdate;
            px.enddate = annee.enddate;
        }
        const semestre = await this.findAnneeByIdAsync(px.semestreid);
        if (semestre) {
            px._semestreSigle = semestre.sigle;
        }
        const groupe = await this.findGroupeByIdAsync(px.groupeid);
        if (groupe) {
            px._groupeSigle = groupe.sigle;
        }
        const matiere = await this.findMatiereByIdAsync(px.matiereid);
        if (matiere) {
            px._matiereSigle = matiere.sigle;
            px._uniteSigle = matiere._uniteSigle;
            px._matiereCoeff = matiere.coefficient;
        }
        this.register_item(px);
        return px;
    } // findAffectationByIdAsync
    public async findEtudAffectationByIdAsync(
        id: string
    ): Promise<IEtudAffectationDoc | undefined> {
        let p = this._internal_find_item(initialEtudAffectation, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialEtudAffectation, id);
        if (!p) {
            return undefined;
        }
        if (p) {
            const annee = await this.findAnneeByIdAsync(p.anneeid);
            if (annee) {
                p._anneeSigle = annee.sigle;
                p.startdate = annee.startdate;
                p.enddate = annee.enddate;
            }
            const semestre = await this.findAnneeByIdAsync(p.semestreid);
            if (semestre) {
                p._semestreSigle = semestre.sigle;
            }
            const groupe = await this.findGroupeByIdAsync(p.groupeid);
            if (groupe) {
                p._groupeSigle = groupe.sigle;
            }
            const etudiant = await this.findEtudiantByIdAsync(p.etudiantid);
            if (etudiant) {
                p._lastname = etudiant.lastname;
                p._firstname = etudiant.firstname;
                p._url = etudiant._url;
                p._photoData = etudiant._photoData;
                p._avatar = etudiant._avatar;
            }
        }
        this.register_item(p);
        return p;
    } // findEtudAffectationByIdAsync
    public async findGroupeControlesByIdAsync(
        id: string
    ): Promise<IGroupeControlesDoc | undefined> {
        let p = this._internal_find_item(initialGroupeControles, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialGroupeControles, id);
        if (!p) {
            return undefined;
        }
        if (p) {
            const pSem = await this.findSemestreByIdAsync(p.semestreid);
            if (pSem) {
                p._semestreSigle = pSem.sigle;
            }
            const pMat = await this.findMatiereByIdAsync(p.matiereid);
            if (pMat) {
                p._matiereSigle = pMat.sigle;
            }
        }
        this.register_item(p);
        return p;
    } // findCGroupeontrolesByIdAsync
    //
    public async findControleByIdAsync(
        id: string
    ): Promise<IControleDoc | undefined> {
        let p = this._internal_find_item(initialControle, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(initialControle, id);
        if (!p) {
            return undefined;
        }
        const pg = await this.findGroupeControlesByIdAsync(p.groupecontroleid);
        if (pg) {
            p._groupeControlesSigle = pg.sigle;
        }
        const aff = await this.findAffectationByIdAsync(p.affectationid);
        if (aff) {
            p._matiereSigle = aff._matiereSigle;
            p._groupeSigle = aff._groupeSigle;
            p._anneeSigle = aff._anneeSigle;
            p._uniteSigle = aff._uniteSigle;
            p._semestreSigle = aff._semestreSigle;
            p._matiereCoeff = aff._matiereCoeff;
        }
        this.register_item(p);
        return p;
    } // findControleByIdAsync
    //
    public async findControleChildByIdAsync<T extends IControleChildDoc>(item: T, id: string, old?: any): Promise<T | undefined> {
        let p: T | undefined = undefined;
        if (old !== undefined && old !== null) {
            p = await this._convertDataAsync(item, old);
            if (!p) {
                return undefined;
            }
        } else {
            if (id === undefined || id === null) {
                return undefined;
            }
            if (id.trim().length < 1) {
                return undefined;
            }
            p = this._internal_find_item(item, id);
            if (p) {
                return p;
            }
            p = await this.loadItemByIdAsync(item, id);
            if (!p) {
                return undefined;
            }
        }// id
        if (!p) {
            return undefined;
        }
        const cont = await this.findControleByIdAsync(p.controleid);
        if (cont) {
            p._matiereSigle = cont._matiereSigle;
            p._groupeSigle = cont._groupeSigle;
            p._anneeSigle = cont._anneeSigle;
            p._uniteSigle = cont._uniteSigle;
            p._semestreSigle = cont._semestreSigle;
            p._date = cont.date;
            p._controleCoeff = cont.coefficient;
            p._controleName = cont.name;
            p._matiereCoeff = cont._matiereCoeff;
        }
        const etudiant = await this.findEtudiantByIdAsync(p.etudiantid);
        if (etudiant) {
            p._lastname = etudiant.lastname;
            p._firstname = etudiant.firstname;
            p._fullname = (etudiant.lastname + " " + etudiant.firstname).trim();
            p._url = etudiant._url;
            p._avatar = etudiant._avatar;
            p._photoData = etudiant._photoData;
        }
        this.register_item(p);
        return p;
    }//findControleChildrenByIdAsyn
    public async findNoteByIdAsync(id: string, old?: any): Promise<INoteDoc | undefined> {
        return this.findControleChildByIdAsync(initialNote, id, old);
    }
    public async findEvtByIdAsync(id: string, old?: any): Promise<IEvtDoc | undefined> {
        return this.findControleChildByIdAsync(initialEvt, id, old);
    }
    //
    public async loadItemByIdAsync<T extends IBaseDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        const doctype = item.doctype;
        const p = await this._datastore.findDocByIdAsync(id);
        if (!p) {
            return undefined;
        }
        const pz = this._convertDataByType(doctype, p);
        return pz;
    } //findItemByIdAsync
    //
    public register_item<T extends IBaseDoc>(p: T) {
        if (!p) {
            return;
        }
        const id = p._id;
        const doctype = p.doctype;
        if (!id || !doctype) {
            return;
        }
        let m = this._data.get(doctype);
        if (!m) {
            m = new Map<string, IBaseDoc>();
            m.set(id, p);
            this._data.set(doctype, m);
        } else {
            m.set(id, p);
        }
    } // _clearItemById
    //
    private async _internal_find_item_by_id_async<T extends IBaseDoc>(
        item: T,
        id: string
    ): Promise<T | undefined> {
        let p = this._internal_find_item(item, id);
        if (p) {
            return p;
        }
        p = await this.loadItemByIdAsync(item, id);
        if (!p) {
            return undefined;
        }
        this.register_item(p);
        return p;
    }
    //
    private _internal_find_item<T extends IBaseDoc>(
        item: T,
        id: string
    ): T | undefined {
        const doctype = item.doctype;
        const m = this._data.get(doctype);
        if (!m) {
            return undefined;
        }
        const p = m.get(id);
        if (!p) {
            return undefined;
        }
        return p as T;
    } //_internal_find_item
    //
    private async _convertDataAsync<T extends IBaseDoc>(
        item: T,
        src: any
    ): Promise<T | undefined> {
        let pRet = ConvertData.ConvertDataItem<T>(item, src);
        if (pRet !== null) {
            if (src._attachments) {
                pRet._attachments = this._getDocAttachments(src);
                const doctype = item.doctype;
                if (doctype === DomainConstants.TYPE_ETUDIANT) {
                    const pxx: any = pRet;
                    const px = pxx as IPersonDoc;
                    await this._check_person_avatar_async(px);
                }
            }
            return pRet;
        }
        return undefined;
    } // _convertData
    private async _check_person_avatar_async(item: IPersonDoc): Promise<void> {
        if (item._attachments && item._attachments.length > 0) {
            let aa = item._attachments;
            let avatar: string = "";
            const n = aa.length;
            if (item.avatar !== undefined && item.avatar !== null) {
                let sa: string = item.avatar;
                if (sa.length > 0) {
                    for (let i = 0; i < n; i++) {
                        let xx = aa[i];
                        let name = xx.name;
                        if (name === sa) {
                            xx.url = await this.getBlobDataUrlAsync(
                                xx.docid ? xx.docid : "",
                                name
                            );
                            item._url = xx.url;
                            avatar = name;
                        }
                        aa[i] = xx;
                    } // i
                } // length
            } //
            if (avatar.length < 1) {
                for (let i = 0; i < n; i++) {
                    let xx = aa[i];
                    const mime = xx.content_type;
                    const name = xx.name ? xx.name : "";
                    if (mime.startsWith(STRING_IMAGE)) {
                        xx.url = await this.getBlobDataUrlAsync(
                            xx.docid ? xx.docid : "",
                            name
                        );
                        item._url = xx.url;
                        item.avatar = avatar;
                        item._modified = true;
                        aa[i] = xx;
                        break;
                    }
                } // i
            } // empty
        } // attachment
    } // check_person_avatar
    public async checkOptionAvatarAsync(
        docid: string,
        attachments: any,
        avatar: string,
        p: IDataOption
    ): Promise<void> {
        if (!docid || !attachments) {
            return;
        }
        if (avatar !== undefined && avatar !== null && avatar.length > 0) {
            for (const key in attachments) {
                if (key === avatar) {
                    const d: IAttachedDoc = attachments[key];
                    if (d.content_type.startsWith(STRING_IMAGE)) {
                        p.url = await this.getBlobDataUrlAsync(docid, avatar);
                        return;
                    }
                } // found
            } // key
        } // avatar
        for (const key in attachments) {
            const d: IAttachedDoc = attachments[key];
            if (d.content_type.startsWith(STRING_IMAGE)) {
                p.url = await this.getBlobDataUrlAsync(docid, key);
                return;
            }
        } // key
    } // _check_option_avatar_async
    public _convertDataByType(doctype: string, src: any): any | null {
        if (doctype) {
            let pRet = ConvertData.ConvertDataItemByType(doctype, src);
            if (pRet !== null) {
                if (src._attachments) {
                    pRet._attachments = this._getDocAttachments(src);
                }
                this.register_item(pRet);
                return pRet;
            }
        } // item
        return null;
    } // _convertData
    //
    private _getDocAttachments(p: any): IAttachedDoc[] {
        const aa = p._attachments;
        if (!aa) {
            return [];
        }
        const pRet: IAttachedDoc[] = [];
        const docid: string = p._id ? p._id : "";
        for (const key in aa) {
            const info: IAttachedDoc = aa[key];
            info.docid = docid;
            info.name = key;
            pRet.push(info);
        } // key
        return pRet;
    } // getDocAttachments
    //
    public async isOnLineAsync(): Promise<boolean> {
        return await this.dataStore.isOnLineAsync();
    }
    public async synchroDataAsync(): Promise<void> {
        this.dataStore.synchroDataAsync();
    }
    public formBlobUrl(id?: string, name?: string): string {
        return this.dataStore.formBlobUrl(id, name);
    }
    public async getBlobDataAsync(id: string, name: string): Promise<ArrayBuffer | undefined> {
        return this.dataStore.getBlobDataAsync(id, name);
    }
    public async findDocByIdAsync(id: string): Promise<any | undefined> {
        return this.dataStore.findDocByIdAsync(id);
    }
    public async findDocRevisionAsync(sid: string): Promise<string | undefined> {
        return this.dataStore.findDocRevisionAsync(sid);
    }
    public async maintainsDocAsync(doc: any): Promise<string | undefined> {
        return this.dataStore.maintainsDocAsync(doc);
    }
    public async removeDocAsync(id: string): Promise<boolean> {
        return this.dataStore.removeDocAsync(id);
    }
    public async maintainsBlobAsync(
        id: string,
        name: string,
        mime: string,
        data: Blob | Buffer,
    ): Promise<string | undefined> {
        return this.dataStore.maintainsBlobAsync(id, name, mime, data);
    }
    public async removeBlobAsync(id: string, name: string): Promise<boolean> {
        return this.dataStore.removeBlobAsync(id, name);
    }
    public async findDocsBySelectorAsync(
        sel: any,
        start?: number,
        count?: number,
        fields?: string[],
        sort?: any[]
    ): Promise<any[]> {
        return this.dataStore.findDocsBySelectorAsync(sel, start, count, fields, sort);
    }
    public async findAllDocsBySelectorAsync(
        sel: any,
        fields?: string[],
        sort?: any[]
    ): Promise<any[]> {
        return this.dataStore.findAllDocsBySelectorAsync(sel, fields, sort);
    }
    public async findAllDocsIdsBySelectorAsync(
        sel: any,
    ): Promise<string[]> {
        return this.dataStore.findAllDocsIdsBySelectorAsync(sel);
    }
    public async findDocsCountBySelectorAsync(sel: any): Promise<number> {
        return this.dataStore.findDocsCountBySelectorAsync(sel);
    }
    public async maintainsManyDocsAsync(docs: any[]): Promise<void> {
        return this.dataStore.maintainsManyDocsAsync(docs);
    }
    public async bulkGetAsync(ids: string[]): Promise<any[]> {
        return this.dataStore.bulkGetAsync(ids);
    }
    public async removeDocsBySelectorAsync(sel: any): Promise<boolean> {
        return this.dataStore.removeDocsBySelectorAsync(sel);
    }
    public async findDocBySelectorAsync(sel: any, fields?: string[]): Promise<any | undefined> {
        return this.dataStore.findDocBySelectorAsync(sel, fields);
    }
    public async getControlesByAnneeSemestreMatiereGroupe(anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IControleDoc[]> {
        const vret: IControleDoc[] = [];
        if (anneeid.length < 1 || semestreid.length < 1 || matiereid.length < 1 || groupeid.length < 1) {
            return vret;
        }
        const affectationid = await this.findOneItemIdByFilter({
            doctype: DomainConstants.TYPE_AFFECTATION,
            anneeid, semestreid, groupeid, matiereid
        });
        if (affectationid !== undefined && affectationid !== null && affectationid.length > 0) {
            const mm = await this.findAllDocsBySelectorAsync(
                {
                    doctype: DomainConstants.TYPE_CONTROLE,
                    affectationid
                },
                [DomainConstants.FIELD_ID]
            );
            if (mm !== undefined && mm !== null) {
                const n = mm.length;
                for (let i = 0; i < n; i++) {
                    const m = mm[i];
                    if (m._id !== undefined && m._id !== null) {
                        const p = await this.findControleByIdAsync("" + m._id);
                        if (p !== undefined && p !== null) {
                            vret.push(p);
                        }
                    } // m
                } // i
            } // mm
            if (vret.length > 1) {
                vret.sort((a, b) => {
                    if (a.date > b.date) {
                        return -1;
                    } else if (a.date < b.date) {
                        return 1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    } else if (a.name < b.name) {
                        return 1;
                    }
                    return 0;
                });
            } // sort
        }//affid
        return vret;
    }//getControlesByAnneeSemestreMatiereGroupe
    //
    public async getControleEtudiantsOptionsAsync(anneeid: string, semestreid: string, groupeid: string): Promise<IDataOption[]> {
        const etuds: IEtudiantDoc[] = [];
        const items: IDataOption[] = [];
        const ee = await this.findAllDocsBySelectorAsync({ 'doctype': DomainConstants.TYPE_ETUDAFFECTATION, 'anneeid': anneeid, 'semestreid': semestreid, 'groupeid': groupeid }, [DomainConstants.FIELD_ETUDIANTID]);
        if (ee !== undefined && ee !== null) {
            const n = ee.length;
            for (let i = 0; i < n; i++) {
                const m = ee[i];
                if (m.etudiantid) {
                    const id = "" + m.etudiantid;
                    const p = await this.findEtudiantByIdAsync(id);
                    if (p !== undefined && p !== null) {
                        etuds.push(p);
                    }
                }
            }// i
        }// ee
        if (etuds.length > 1) {
            etuds.sort((a, b) => {
                if (a.lastname < b.lastname) {
                    return -1;
                } else if (a.lastname > b.lastname) {
                    return 1;
                }
                if (a.firstname < b.firstname) {
                    return -1;
                } else if (a.firstname > b.firstname) {
                    return 1;
                }
                return 0;
            });
        }
        for (let i = 0; i <= etuds.length; i++) {
            const p = etuds[i];
            if (p !== undefined && p !== null) {
                const pp: IDataOption = {
                    value: p._id,
                    name: p.lastname.toUpperCase() + " " + p.firstname,
                    subTitle: p.observations,
                    avatar: p.lastname.substr(0, 1).toUpperCase() +
                        p.firstname.substr(0, 1).toUpperCase(),
                    url: p._url,
                };
                items.push(pp);
            }
        }// i
        return items;
    } //findEtudiantsOptionsAsync
    public async getEtudiantsOptionsAsync(filter: any): Promise<IDataOption[]> {
        const items: IDataOption[] = [];
        let xfilter: any = {};
        if (filter !== undefined && filter !== null) {
            xfilter = Object.assign({}, xfilter, filter);
        }
        xfilter[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_ETUDIANT;
        const n = await this.findDocsCountBySelectorAsync(xfilter);
        if (n < 1) {
            return items;
        }
        const fields: string[] = [
            DomainConstants.FIELD_ID,
            DomainConstants.FIELD_FIRSTNAME,
            DomainConstants.FIELD_LASTNAME,
            DomainConstants.FIELD_AVATAR,
            DomainConstants.FIELD_ATTACHMENTS,
            DomainConstants.FIELD_OBSERVATIONS,
        ];
        const sort: any[] = [{ lastname: STRING_ASC }, { firstname: STRING_ASC }];
        const dd = await this.findDocsBySelectorAsync(
            xfilter,
            0,
            n,
            fields,
            sort
        );
        if (dd === undefined || dd === null) {
            return items;
        }
        const nx = dd.length;
        if (nx < 1) {
            return items;
        }
        for (let i = 0; i < nx; i++) {
            const v = dd[i];
            if (v && v._id && v.lastname && v.firstname) {
                const id = v._id as string;
                const lastname = (v.lastname as string).toUpperCase();
                const firstname = v.firstname as string;
                const title = lastname + " " + firstname;
                const avatar =
                    lastname.substr(0, 1).toUpperCase() +
                    firstname.substr(0, 1).toUpperCase();
                const subTitle = (v.observations) ? v.observations : "";
                const p: IDataOption = {
                    value: id,
                    name: title,
                    avatar,
                    subTitle,
                };
                await this.checkOptionAvatarAsync(id, v._attachments, v.avatar, p);
                if (p.url === undefined || p.url === null) {
                    const url = this.getPhotoUrl(id);
                    if (url) {
                        p.url = url;
                    }
                }
                items.push(p);
            }
        } // i
        return items;
    } //findEtudiantsOptionsAsync
} // class InfoDataStore
