import { DomainConstants } from "../domain/DomainConstants";
import type { IGroupeControlesDoc } from "../domain/IGroupeControlesDoc";
import { initialGroupeControles } from "../domain/IGroupeControlesDoc";
import { StatusType } from "../domain/StatusType";
import { ControleServices } from "./ControleServices";
import { ItemServices } from "./ItemServices";

//
export class GroupeControlesServices extends ItemServices<IGroupeControlesDoc> {
    //
    constructor(baseurl?: string, databasename?: string) {
        super(initialGroupeControles, baseurl, databasename);
    }
    //
    protected async fetchUniqueId(current: IGroupeControlesDoc): Promise<string | undefined> {
        const store = this.datastore;
        if (current._id.trim().length > 0) {
            const rev = await store.findDocRevisionAsync(current._id);
            if (rev !== undefined && rev !== null && rev.length > 0) {
                return current._id;
            }
        }
        const matiereid = current.matiereid;
        const semestreid = current.semestreid;
        if (matiereid.length > 0 && semestreid.length > 0) {
            const sigle = current.sigle;
            if (sigle.length > 0) {
                const ix = await store.findOneItemIdByFilter({
                    docid: DomainConstants.TYPE_GROUPCONTROLE,
                    matiereid, semestreid, sigle,
                });
                if (ix !== undefined && ix !== null && ix.length > 0) {
                    return ix;
                }
            }// sigle
            const name = current.name;
            if (sigle.length > 0) {
                const ix = await store.findOneItemIdByFilter({
                    docid: DomainConstants.TYPE_GROUPCONTROLE,
                    matiereid, semestreid, name,
                });
                if (ix !== undefined && ix !== null && ix.length > 0) {
                    return ix;
                }
            }// sigle
        }// matiere && semestre
        return '';
    } // fetchUniqueId
    //
    protected isStoreable(p: IGroupeControlesDoc): boolean {
        return p.semestreid.length > 0 &&
            p.matiereid.length > 0 && p.sigle.length > 0 && p.name.length > 0;
    }// getPersistMap
    protected getPersistMap(current: IGroupeControlesDoc): any {
        const data: any = {};
        const matiereid = current.matiereid;
        const semestreid = current.semestreid;
        const sigle = current.sigle
        const name = current.name;
        if (current._id.trim().length > 0) {
            data[DomainConstants.FIELD_ID] = current._id;
        }
        data[DomainConstants.FIELD_TYPE] = DomainConstants.TYPE_GROUPCONTROLE;
        data[DomainConstants.FIELD_MATIEREID] = matiereid;
        data[DomainConstants.FIELD_SEMESTREID] = semestreid;
        data[DomainConstants.FIELD_SIGLE] = sigle;
        data[DomainConstants.FIELD_NAME] = name;
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
        return data;
    } // SaveItemAsync
    public async removeItemAsync(p: IGroupeControlesDoc): Promise<boolean> {
        const id = p._id;
        const rev = p._rev;
        if (id.trim().length < 1 || rev.trim().length < 1) {
            return false;
        }
        const store = this.datastore;
        const ids = await store.findAllDocsIdsBySelectorAsync({ doctype: DomainConstants.TYPE_CONTROLE, groupecontroleid: p._id });
        if (ids !== undefined && ids !== null && ids.length > 0) {
            const px = new ControleServices();
            const n = ids.length;
            for (let i = 0; i < n; i++) {
                const p = await store.findControleByIdAsync(ids[i]);
                if (p !== undefined && p !== null) {
                    await px.removeItemAsync(p);
                }
            }// i
        }// ids
        return super.removeItemAsync(p);
    }//removeItemAsync

} // class ControleServices
  //
