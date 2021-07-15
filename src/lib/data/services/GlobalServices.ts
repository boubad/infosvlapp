import { DomainConstants } from "../domain/DomainConstants";
import { CreateAnnee } from "../domain/IAnneeDoc";
import { CreateAffectation, IAffectationDoc } from "../domain/IAffectationDoc";
import { CreateGroupe } from "../domain/IGroupeDoc";
import { CreateMatiere } from "../domain/IMatiereDoc";
import { CreateSemestre } from "../domain/ISemestreDoc";
import { CreateUnite } from "../domain/IUniteDoc";
import type { IDataOption } from "../domain/IDataOption";
import { BaseServices } from "./BaseServices";
import type { IGlobalStatePayload } from "./IGlobalStatePayload";

export class GlobalServices extends BaseServices {
    constructor(baseurl?: string, databasename?: string, username?: string, password?: string) {
        super(baseurl, databasename, username, password);
    }
    //
    private _selectItemId(options: IDataOption[], oldId: string): string {
        const n = options.length;
        if (oldId.length > 0) {
            for (let i = 0; i < n; i++) {
                if (options[i].value === oldId) {
                    return oldId;
                }
            }// i
        }// oldId
        let sret = "";
        if (n > 1) {
            sret = options[1].value;
        }
        return sret;
    }// _selectItemId
    //
    public async getAffectationByAnneeSemestreMatiereGroupe(anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IAffectationDoc | undefined> {
        if (anneeid.length < 1 || semestreid.length < 1 || matiereid.length < 1 || groupeid.length < 1) {
            return undefined;
        }
        const m = await this.datastore.findDocBySelectorAsync({
            doctype: DomainConstants.TYPE_AFFECTATION,
            anneeid,
            semestreid,
            matiereid,
            groupeid,
        }, [DomainConstants.FIELD_ID]);
        if (m == undefined || m === null) {
            return undefined;
        }
        const affid = m[DomainConstants.FIELD_ID];
        if (affid !== undefined && affid !== null) {
            const p = await this.datastore.findAffectationByIdAsync("" + affid);
            if (p !== undefined && p !== null) {
                return p;
            }
        }
        return undefined;
    }//getAffectationByAnneeSemestreMatiereGroupe
    //
    private async _checkData(pRet: IGlobalStatePayload, anneeid: string, semestreid: string, matiereid: string, groupeid: string) {
        if (anneeid.length < 1 || semestreid.length < 1) {
            return;
        }
        const store = this.datastore;
        if (matiereid.length > 0) {
            const gg = await store.getGroupeControlesOptionsAsync(semestreid, matiereid);
            if (gg !== undefined && gg !== null) {
                pRet.groupescontroles = gg;
            }
        }// matiereid
        if (groupeid.length > 0) {
            const ee = await store.getControleEtudiantsOptionsAsync(
                anneeid,
                semestreid,
                groupeid
            );
            if (ee !== undefined && ee !== null) {
                pRet.etudiants = ee;
            }
        }
        const aff = await this.getAffectationByAnneeSemestreMatiereGroupe(anneeid, semestreid, matiereid, groupeid);
        if (aff !== undefined && aff !== null) {
            pRet.affectation = aff;
            const cc = await store.getControlesByAnneeSemestreMatiereGroupe(
                anneeid,
                semestreid,
                matiereid,
                groupeid
            );
            if (cc !== undefined && cc !== null) {
                pRet.controles = cc;
            }
        }
    }//_checkData
    //
    public async refreshAnneesAsync(anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            annees: [],
            annee: CreateAnnee(),
            etudiants: [],
            controles: [],
            affectation: CreateAffectation(),
        };
        const store = this.datastore;
        const annees = await store.getAnneesOptionsAsync();
        pRet.annees = annees;
        anneeid = this._selectItemId(annees, anneeid);
        if (anneeid.length < 1) {
            return pRet;
        }
        const a = await store.findAnneeByIdAsync(anneeid);
        if (a === undefined || a === null) {
            return pRet;
        }
        pRet.annee = a;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //RefreshAnneeAsync
    public async changeAnneeIdAsync(id: string, semestreid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            annee: CreateAnnee(),
            etudiants: [],
            controles: [],
            affectation: CreateAffectation(),
        };
        if (id.length < 1) {
            return pRet;
        }
        const store = this.datastore;
        const a = await store.findAnneeByIdAsync(id);
        if (a === undefined || a === null) {
            return pRet;
        }
        pRet.annee = a;
        await this._checkData(pRet, id, semestreid, matiereid, groupeid);
        return pRet;
    }//changeAnneeIdAsync
    //
    public async RefreshSemestresAsync(anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            semestres: [],
            semestre: CreateSemestre(),
            groupes: [],
            groupe: CreateGroupe(),
            groupescontroles: [],
            etudiants: [],
            controles: [],
            affectation: CreateAffectation(),
        };
        const store = this.datastore;
        const semestres = await store.getSemestresOptionsAsync();
        pRet.semestres = semestres;
        semestreid = this._selectItemId(semestres, semestreid);
        if (semestreid.length < 1) {
            return pRet;
        }
        const sem = await store.findSemestreByIdAsync(semestreid);
        if (sem === undefined || sem === null) {
            return;
        }
        pRet.semestre = sem;
        const groupes = await store.getGroupesOptionsAsync(semestreid);
        pRet.groupes = groupes;
        groupeid = this._selectItemId(groupes, groupeid);
        if (groupes.length > 1) {
            return pRet;
        }
        const g = await store.findGroupeByIdAsync(groupeid);
        if (g === undefined || g === null) {
            return pRet;
        }
        pRet.groupe = g;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //RefreshSemestreAsync
    public async changeSemestreIdAsync(id: string, anneeid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            semestre: CreateSemestre(),
            groupes: [],
            groupe: CreateGroupe(),
            groupescontroles: [],
            etudiants: [],
            controles: [],
            affectation: CreateAffectation(),
        };
        if (id.length < 1) {
            return pRet;
        }
        const store = this.datastore;
        const sem = await store.findSemestreByIdAsync(id);
        if (sem === undefined || sem === null) {
            return pRet;
        }
        pRet.semestre = sem;
        const groupes = await store.getGroupesOptionsAsync(id);
        pRet.groupes = groupes;
        groupeid = this._selectItemId(groupes, groupeid);
        if (groupes.length > 1) {
            return pRet;
        }
        const g = await store.findGroupeByIdAsync(groupeid);
        if (g === undefined || g === null) {
            return pRet;
        }
        pRet.groupe = g;
        await this._checkData(pRet, anneeid, id, matiereid, groupeid);
        return pRet;
    }//changeAnneeIdAsync
    //
    public async refreshGroupesAsync(anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            groupes: [],
            groupe: CreateGroupe(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            etudiants: [],
            controles: [],
        };
        const store = this.datastore;
        const groupes = await store.getGroupesOptionsAsync(semestreid);
        pRet.groupes = groupes;
        groupeid = this._selectItemId(groupes, groupeid);
        if (groupeid.length < 1) {
            return pRet;
        }
        const g = await store.findGroupeByIdAsync(groupeid);
        if (g === undefined || g === null) {
            return pRet;
        }
        pRet.groupe = g;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //refreshGroupeAsync
    public async changeGroupeIdAsync(id: string, anneeid: string, semestreid: string, matiereid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            groupe: CreateGroupe(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            etudiants: [],
            controles: [],
        };
        if (id.length < 1) {
            return pRet;
        }
        const store = this.datastore;
        const g = await store.findGroupeByIdAsync(id);
        if (g === undefined || g === null) {
            return pRet;
        }
        pRet.groupe = g;
        await this._checkData(pRet, anneeid, semestreid, matiereid, id);
        return pRet;
    } //changeGroupeIdAsyn
    //
    public async refreshUnitesAsync(anneeid: string, semestreid: string, matiereid: string, groupeid: string, uniteid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            unites: [],
            unite: CreateUnite(),
            matieres: [],
            matiere: CreateMatiere(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            controles: [],
        };
        const store = this.datastore;
        const unites = await store.getUnitesOptionsAsync();
        pRet.unites = unites;
        uniteid = this._selectItemId(unites, uniteid);
        if (uniteid.length < 1) {
            return pRet;
        }
        const u = await store.findUniteByIdAsync(uniteid);
        if (u === undefined || u === null) {
            return pRet;
        }
        pRet.unite = u;
        const matieres = await store.getMatieresOptionsAsync(uniteid);
        pRet.matieres = matieres;
        matiereid = this._selectItemId(matieres, matiereid);
        if (matiereid.length < 1) {
            return pRet;
        }
        const m = await store.findMatiereByIdAsync(matiereid);
        if (m === undefined || m === null) {
            return pRet;
        }
        pRet.matiere = m;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //refreshUnitesAsync
    public async changeUniteIdAsync(id: string, anneeid: string, semestreid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            unite: CreateUnite(),
            matieres: [],
            matiere: CreateMatiere(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            controles: [],
        };
        if (id.length < 1) {
            return pRet;
        }
        const store = this.datastore;
        const u = await store.findUniteByIdAsync(id);
        if (u === undefined || u === null) {
            return pRet;
        }
        pRet.unite = u;
        const matieres = await store.getMatieresOptionsAsync(id);
        pRet.matieres = matieres;
        matiereid = this._selectItemId(matieres, matiereid);
        if (matiereid.length < 1) {
            return pRet;
        }
        const m = await store.findMatiereByIdAsync(matiereid);
        if (m === undefined || m === null) {
            return pRet;
        }
        pRet.matiere = m;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //changeUniteIdAsync
    public async refreshMatieresAsync(anneeid: string, semestreid: string, matiereid: string, groupeid: string, uniteid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            matieres: [],
            matiere: CreateMatiere(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            controles: [],
        };
        if (uniteid.length < 1) {
            return pRet
        }
        const store = this.datastore;
        const matieres = await store.getMatieresOptionsAsync(uniteid);
        pRet.matieres = matieres;
        matiereid = this._selectItemId(matieres, matiereid);
        if (matiereid.length < 1) {
            return pRet;
        }
        const m = await store.findMatiereByIdAsync(matiereid);
        if (m === undefined || m === null) {
            return pRet;
        }
        pRet.matiere = m;
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //refreshMatieresAsync
    public async changeMatiereIdAsync(id: string, anneeid: string, semestreid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            matiere: CreateMatiere(),
            affectation: CreateAffectation(),
            groupescontroles: [],
            controles: [],
        };
        if (id.length < 1) {
            return pRet
        }
        const store = this.datastore;
        const m = await store.findMatiereByIdAsync(id);
        if (m === undefined || m === null) {
            return pRet;
        }
        pRet.matiere = m;
        await this._checkData(pRet, anneeid, semestreid, id, groupeid);
        return pRet;
    } //refreshMatieresAsync
    public async refreshAllAsync(anneeid: string, semestreid: string, uniteid: string, matiereid: string, groupeid: string): Promise<IGlobalStatePayload> {
        let pRet: IGlobalStatePayload = {
            annees: [],
            annee: CreateAnnee(),
            semestres: [],
            semestre: CreateSemestre(),
            groupes: [],
            groupe: CreateGroupe(),
            unites: [],
            unite: CreateUnite(),
            matieres: [],
            matiere: CreateMatiere(),
            groupescontroles: [],
            etudiants: [],
            controles: [],
            affectation: CreateAffectation(),
        };
        const store = this.datastore;
        const annees = await store.getAnneesOptionsAsync();
        pRet.annees = annees;
        anneeid = this._selectItemId(annees, anneeid);
        if (anneeid.length > 0) {
            const a = await store.findAnneeByIdAsync(anneeid);
            if (a !== undefined && a !== null) {
                pRet.annee = a;
            } else {
                anneeid = '';
            }
        }
        const semestres = await store.getSemestresOptionsAsync();
        pRet.semestres = semestres;
        semestreid = this._selectItemId(semestres, semestreid);
        if (semestreid.length > 0) {
            const s = await store.findSemestreByIdAsync(semestreid);
            if (s !== undefined && s !== null) {
                pRet.semestre = s;
            } else {
                semestreid = '';
            }
        }
        if (semestreid.length > 0) {
            const groupes = await store.getGroupesOptionsAsync(semestreid);
            pRet.groupes = groupes;
            groupeid = this._selectItemId(groupes, groupeid);
            if (groupeid.length > 0) {
                const g = await store.findGroupeByIdAsync(groupeid);
                if (g !== undefined && g !== null) {
                    pRet.groupe = g;
                } else {
                    groupeid = '';
                }
            }
        }// semestreid
        const unites = await store.getUnitesOptionsAsync();
        pRet.unites = unites;
        uniteid = this._selectItemId(unites, uniteid);
        if (uniteid.length > 0) {
            const u = await store.findUniteByIdAsync(uniteid);
            if (u !== undefined && u !== null) {
                pRet.unite = u;
            } else {
                uniteid = '';
            }
        }
        if (uniteid.length > 0) {
            const matieres = await store.getMatieresOptionsAsync(uniteid);
            pRet.matieres = matieres;
            matiereid = this._selectItemId(matieres, matiereid);
            if (matiereid.length > 0) {
                const m = await store.findMatiereByIdAsync(matiereid);
                if (m !== undefined && m !== null) {
                    pRet.matiere = m;
                } else {
                    matiereid = '';
                }
            }
        }// semestreid
        await this._checkData(pRet, anneeid, semestreid, matiereid, groupeid);
        return pRet;
    } //RefreshAllAsync
    //

} // class AppStateServices
