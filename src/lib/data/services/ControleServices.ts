import { ControleType } from "../domain/ControleType";
import { DomainConstants } from "../domain/DomainConstants";
import type { IControleDoc } from "../domain/IControleDoc";
import { initialControle } from "../domain/IControleDoc";
import { CreateNote, INoteDoc } from "../domain/INoteDoc";
import { StatusType } from "../domain/StatusType";
import type { IItemPayload } from "./IItemPayload";
import { ItemServices } from "./ItemServices";

//
export class ControleServices extends ItemServices<IControleDoc> {
    //
    constructor(baseurl?: string, databasename?: string) {
        super(initialControle, baseurl, databasename);
    }
    //
    protected async fetchUniqueId(current: IControleDoc): Promise<string | undefined> {
        const store = this.datastore;
        if (current._id.trim().length > 0) {
            const rev = await store.findDocRevisionAsync(current._id);
            if (rev !== undefined && rev !== null && rev.length > 0) {
                return current._id;
            }
        }
        const affectationid = current.affectationid;
        const date = current.date;
        const name = current.name;
        if (affectationid.length > 1 && date.length >= 10 && name.length > 0) {
            const ix = await store.findOneItemIdByFilter({
                docid: DomainConstants.TYPE_CONTROLE,
                affectationid, date, name
            });
            if (ix !== undefined && ix !== null && ix.length > 0) {
                return ix;
            }
        } // id
        return '';
    } // fetchUniqueId
    //
    protected isStoreable(p: IControleDoc): boolean {
        return p.affectationid.length > 0 &&
            p.groupecontroleid.length > 0 &&
            p.date.length >= 10 &&
            p.name.length > 0 &&
            p.controletype != ControleType.Unknown;
    }// getPersistMap
    protected getPersistMap(current: IControleDoc): any {
        const data: any = {};
        const groupecontroleid = current.groupecontroleid;
        const affectationid = current.affectationid;
        const date = current.date
        const name = current.name;
        if (current._id.trim().length > 0) {
            data[DomainConstants.FIELD_ID] = current._id;
        }
        data[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_CONTROLE;
        data[DomainConstants.FIELD_GROUPECONTROLEID] = groupecontroleid;
        data[DomainConstants.FIELD_AFFECTATIONID] = affectationid;
        data[DomainConstants.FIELD_DATE] = date;
        data[DomainConstants.FIELD_NAME] = name;
        const place = current.place ? current.place.trim() : "";
        if (place.length > 0) {
            data[DomainConstants.FIELD_PLACE] = place;
        }
        const duration = current.duration ? current.duration.trim() : "";
        if (duration.length > 0) {
            data[DomainConstants.FIELD_DURATION] = duration;
        }
        data[DomainConstants.FIELD_HASNOTES] = current.hasnotes;
        if (current.coefficient && current.coefficient > 0) {
            data[DomainConstants.FIELD_COEFFICIENT] = current.coefficient;
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
        if (
            current.controletype !== undefined &&
            current.controletype !== null &&
            current.controletype !== ControleType.Unknown
        ) {
            data[DomainConstants.FIELD_CONTROLETYPE] = current.controletype;
        }
        return data;
    } // SaveItemAsync
    public async saveItemAsync(item: IControleDoc): Promise<IItemPayload<IControleDoc>> {
        const pRet: IItemPayload<IControleDoc> = {};
        if (!this.isStoreable(item)) {
            return pRet;
        }
        const store = this.datastore;
        const data = this.getPersistMap(item);
        const bIsNew = item._id.length < 1 || item._rev.length < 1;
        const hasNotes = item.hasnotes;
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
            if (bIsNew && hasNotes){
                await this.checkControleNotesAsync(id);
            }
            return this.selectItemAsync(id);
        }
        return pRet;
    }//saveItemAsync
    public async removeItemAsync(p: IControleDoc): Promise<boolean> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return false;
        }
        const store = this.datastore;
        await store.removeDocsBySelectorAsync({
            controleid: id
        });
        return super.removeItemAsync(p);
    }//removeItemAsync
    public async checkControleNotesAsync(controleid: string): Promise<boolean> {
        if (controleid.length < 1) {
            return false;
        }
        const store = this.datastore;
        const pCont = await store.findControleByIdAsync(controleid);
        if (pCont === undefined || pCont === null) {
            return false;
        }
        const pAff = await store.findAffectationByIdAsync(pCont.affectationid);
        if (pAff === undefined || pAff === null) {
            return false;
        }
        const notes: INoteDoc[] = [];
        const mm = await store.findAllDocsBySelectorAsync({
            doctype: DomainConstants.TYPE_ETUDAFFECTATION,
            anneeid: pAff.anneeid,
            semestreid: pAff.semestreid,
            groupeid: pAff.groupeid,
        }, [DomainConstants.FIELD_ID]);
        if (mm !== undefined && mm !== null) {
            const n = mm.length;
            for (let i = 0; i < n; i++) {
                const m = mm[i];
                if (m && m._id) {
                    const etudiantid = "" + m._id;
                    const nx = await store.findDocBySelectorAsync({
                        doctype: DomainConstants.TYPE_NOTE,
                        controleid, etudiantid
                    }, [DomainConstants.FIELD_ID]);
                    if (nx === undefined || nx === null) {
                        const p = CreateNote();
                        p.controleid = controleid;
                        p.etudiantid = etudiantid;
                        p.doctype = DomainConstants.TYPE_NOTE;
                        notes.push(p);
                    }
                }// id
            }// i
        }// mm
        if (notes.length > 0) {
            const n = notes.length;
            for (let i = 0; i < n; i++) {
                const sx = await store.maintainsDocAsync(notes[i]);
                if (sx === undefined || sx === null || sx.length < 1) {
                    return false;
                }// sx
            }// i
        }// notes
        return true;
    } //CheckControleNotesAsync
} // class ControleServices
  //
