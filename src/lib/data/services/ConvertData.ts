import { ControleType } from "../domain/ControleType";
import { DomainConstants } from "../domain/DomainConstants";
import { EvtType } from "../domain/EvtType";
import type { IAffectationBaseDoc } from "../domain/IAffectationBaseDoc";
import { CreateAffectation, IAffectationDoc } from "../domain/IAffectationDoc";
import { CreateAnnee, IAnneeDoc } from "../domain/IAnneeDoc";
import type { IBaseDoc } from "../domain/IBaseDoc";
import type { IControleChildDoc } from "../domain/IControleChildDoc";
import { CreateControle, IControleDoc } from "../domain/IControleDoc";
import { CreateEtudAffectation, IEtudAffectationDoc } from "../domain/IEtudAffectationDoc";
import { CreateEtudiant, IEtudiantDoc } from "../domain/IEtudiantDoc";
import { CreateEvt, IEvtDoc } from "../domain/IEvtDoc";
import { CreateGroupeControles, IGroupeControlesDoc } from "../domain/IGroupeControlesDoc";
import { CreateGroupe, IGroupeDoc } from "../domain/IGroupeDoc";
import { CreateMatiere, IMatiereDoc } from "../domain/IMatiereDoc";
import { CreateNote, INoteDoc } from "../domain/INoteDoc";
import type { IPersonDoc } from "../domain/IPersonDoc";
import { CreateSemestre, ISemestreDoc } from "../domain/ISemestreDoc";
import type { ISigleNamedDoc } from "../domain/ISigleNamedDoc";
import { CreateUnite, IUniteDoc } from "../domain/IUniteDoc";
import type { IItemAffectation, IItemAnnee, IItemBaseAffectation, IItemControle, IItemControleChild, IItemDoc, IItemEtudAffectation, IItemEtudiant, IItemEvt, IItemFieldEvent, IItemGroupe, IItemGroupeControles, IItemMatiere, IItemNote, IItemPerson, IItemSemestre, IItemSigleNamed, IItemUnite } from "./InfoDomain";

//
export class ConvertData {
    //
    public static CreateItem(doctype: string): any | undefined {
        switch (doctype) {
            case DomainConstants.TYPE_AFFECTATION:
                return CreateAffectation();
            case DomainConstants.TYPE_ANNEE:
                return CreateAnnee();
            case DomainConstants.TYPE_CONTROLE:
                return CreateControle();
            case DomainConstants.TYPE_ETUDAFFECTATION:
                return CreateEtudAffectation();
            case DomainConstants.TYPE_ETUDIANT:
                return CreateEtudiant();
            case DomainConstants.TYPE_EVT:
                return CreateEvt();
            case DomainConstants.TYPE_GROUPE:
                return CreateGroupe();
            case DomainConstants.TYPE_MATIERE:
                return CreateMatiere();
            case DomainConstants.TYPE_NOTE:
                return CreateNote();
            case DomainConstants.TYPE_SEMESTRE:
                return CreateSemestre();
            case DomainConstants.TYPE_UNITE:
                return CreateUnite();
            case DomainConstants.TYPE_GROUPCONTROLE:
                return CreateGroupeControles();
            default:
                break;
        } // stype
        return undefined;
    } // CreateItem
    //
    public static ConvertDataItemByType(doctype: string, src: any): any | undefined {
        switch (doctype) {
            case DomainConstants.TYPE_AFFECTATION:
                return ConvertData._ConvertAffectationDoc(src);
            case DomainConstants.TYPE_ANNEE:
                return ConvertData._ConvertAnneeDoc(src);
            case DomainConstants.TYPE_CONTROLE:
                return ConvertData._ConvertControleDoc(src);
            case DomainConstants.TYPE_ETUDAFFECTATION:
                return ConvertData._ConvertEtudAffectationDoc(src);
            case DomainConstants.TYPE_ETUDIANT:
                return ConvertData._ConvertEtudiantDoc(src);
            case DomainConstants.TYPE_EVT:
                return ConvertData._ConvertEvtDoc(src);
            case DomainConstants.TYPE_GROUPE:
                return ConvertData._ConvertGroupeDoc(src);
            case DomainConstants.TYPE_MATIERE:
                return ConvertData._ConvertMatiereDoc(src);
            case DomainConstants.TYPE_NOTE:
                return ConvertData._ConvertNoteDoc(src);
            case DomainConstants.TYPE_SEMESTRE:
                return ConvertData._ConvertSemestreDoc(src);
            case DomainConstants.TYPE_UNITE:
                return ConvertData._ConvertUniteDoc(src);
            case DomainConstants.TYPE_GROUPCONTROLE:
                return ConvertData._ConvertGroupeControlesDoc(src);
            default:
                break;
        } // stype
        return undefined;
    } // ConvertDataItem
    public static ConvertDataItem<T extends IBaseDoc>(
        item: T,
        src: any
    ): T | null {
        const x: any = ConvertData.ConvertDataItemByType(item.doctype, src);
        return x as T;
    } // ConvertDataItem
    //
    private static _ConvertGroupeDoc(p: IItemGroupe): IGroupeDoc {
        const pp = CreateGroupe();
        ConvertData._ConvertSigleNamedDoc(p, pp);
        if (p.semestreid) {
            pp.semestreid = p.semestreid.trim();
        }
        if (p.parentid) {
            pp.parentid = p.parentid;
        }
        if (p.groupetype !== undefined && p.groupetype !== null) {
            pp.groupetype = p.groupetype;
        }
        return pp;
    } // ConvertGroupeDoc
    private static _ConvertSemestreDoc(p: IItemSemestre): ISemestreDoc {
        const pp = CreateSemestre();
        ConvertData._ConvertSigleNamedDoc(p, pp);
        return pp;
    } //CconvertSemestreDoc
    private static _ConvertUniteDoc(p: IItemUnite): IUniteDoc {
        const pp = CreateUnite();
        ConvertData._ConvertSigleNamedDoc(p, pp);
        return pp;
    } // convertUniteDoc
    private static _ConvertMatiereDoc(p: IItemMatiere): IMatiereDoc {
        const pp = CreateMatiere();
        ConvertData._ConvertSigleNamedDoc(p, pp);
        pp.uniteid = p.uniteid ? p.uniteid : "";
        pp.module_name = p.modname ? p.modname : "";
        pp.coefficient = p.coefficient ? p.coefficient : 1.0;
        pp.ecs = p.ecs ? p.ecs : 0;
        return pp;
    } // convertMatiereDoc
    private static _ConvertAnneeDoc(p: IItemAnnee): IAnneeDoc {
        const pp = CreateAnnee();
        ConvertData._ConvertSigleNamedDoc(p, pp);
        pp.startdate = p.startdate ? p.startdate : "";
        pp.enddate = p.enddate ? p.enddate : "";
        return pp;
    } // convertAnneeDoc
    //
    private static _ConvertEtudiantDoc(p: IItemEtudiant): IEtudiantDoc {
        const pp = CreateEtudiant();
        ConvertData._ConvertPersonDoc(p, pp);
        pp.ident = p.ident ? p.ident : "";
        pp.departement = p.departement ? p.departement : "";
        pp.ville = p.ville ? p.ville : "";
        pp.etablissement = p.etablissement ? p.etablissement : "";
        pp.seriebac = p.seriebac ? p.seriebac : "";
        pp.optionbac = p.optionbac ? p.optionbac : "";
        pp.mentionbac = p.mentionbac ? p.mentionbac : "";
        pp.apb = p.apb ? p.apb : null;
        pp.birthyear = p.birthyear ? p.birthyear : 0;
        pp.sup = p.sup ? p.sup : "";
        pp.redoublant = p.redoublant ? p.redoublant : "";
        pp.typeformation = p.typeformation ? p.typeformation : "";
        if (p.notedirty !== undefined && p.notedirty !== null) {
            pp.notedirty = p.notedirty;
        }
        if (p.evtdirty !== undefined && p.evtdirty !== null) {
            pp.evtdirty = p.evtdirty;
        }
        if (p.data !== undefined && p.data !== null) {
            pp.data = p.data;
        }
        if (p.s0 !== undefined && p.s0 !== null) {
            pp.s0 = p.s0;
        }
        if (p.s1 !== undefined && p.s2 !== null) {
            pp.s1 = p.s1;
        }
        if (p.s2 !== undefined && p.s2 !== null) {
            pp.s2 = p.s2;
        }
        if (p.s3 !== undefined && p.s3 !== null) {
            pp.s3 = p.s3;
        }
        if (p.s4 !== undefined && p.s4 !== null) {
            pp.s4 = p.s4;
        }
        if (p.s5 !== undefined && p.s5 !== null) {
            pp.s5 = p.s5;
        }
        if (p.s6 !== undefined && p.s6 !== null) {
            pp.s6 = p.s6;
        }
        return pp;
    } // ConvertEtudiantDoc
    //
    private static _ConvertAffectationDoc(p: IItemAffectation): IAffectationDoc {
        const pp = CreateAffectation();
        ConvertData._ConvertBaseAffectationDoc(p, pp);
        pp.matiereid = p.matiereid ? p.matiereid : "";
        return pp;
    } // convertAffectationDoc
    private static _ConvertEtudAffectationDoc(
        p: IItemEtudAffectation
    ): IEtudAffectationDoc {
        const pp = CreateEtudAffectation();
        ConvertData._ConvertBaseAffectationDoc(p, pp);
        pp.etudiantid = p.etudiantid ? p.etudiantid : "";
        return pp;
    } // convertEtudAffectationDoc
    private static _ConvertGroupeControlesDoc(p: IItemGroupeControles): IGroupeControlesDoc {
        const pp = CreateGroupeControles();
        ConvertData._ConvertBaseDoc(p, pp);
        pp.semestreid = p.semestreid ? p.semestreid : "";
        pp.matiereid = p.matiereid ? p.matiereid : "";
        pp.sigle = p.sigle ? p.sigle : "";
        pp.name = p.name ? p.name : "";
        return pp;
    } // convertControleDoc
    private static _ConvertControleDoc(p: IItemControle): IControleDoc {
        const pp = CreateControle();
        ConvertData._ConvertBaseDoc(p, pp);
        pp.groupecontroleid = (p.groupecontroleid) ? p.groupecontroleid : "";
        pp.controletype =
            p.controletype !== undefined && p.controletype !== null
                ? p.controletype
                : ControleType.Unknown;
        pp.affectationid = p.affectationid ? p.affectationid : "";
        pp.date = p.date ? p.date : "";
        pp.name = p.name ? p.name : "";
        pp.place = p.place ? p.place : "";
        pp.duration = p.duration ? p.duration : "";
        pp.coefficient = p.coefficient ? p.coefficient : 1.0;
        pp.hasnotes =
            p.hasnotes !== undefined && p.hasnotes != null ? p.hasnotes : true;
        pp._text = pp.name;
        return pp;
    } // convertControleDoc

    private static _ConvertEvtDoc(p: IItemEvt): IEvtDoc {
        const pp = CreateEvt();
        ConvertData._ConvertControleChildDoc(p, pp);
        pp.evttype =
            p.evttype !== undefined && p.evttype !== null
                ? p.evttype
                : EvtType.Inconnu;
        pp.justifie = p.justifie ? p.justifie : false;
        pp.duration = p.duration ? p.duration : "";
        return pp;
    } // convertEvtDoc
    private static _ConvertNoteDoc(p: IItemNote): INoteDoc {
        const pp = CreateNote();
        ConvertData._ConvertControleChildDoc(p, pp);
        pp.value = (p.value !== undefined && p.value !== null) ? p.value : null;
        return pp;
    } // convertNoteDoc
    //
    private static _ConvertBaseDoc(p: IItemDoc, pp: IBaseDoc) {
        pp._id = p._id ? p._id : "";
        pp._rev = p._rev ? p._rev : "";
        pp.doctype = p.doctype ? p.doctype : "";
        pp.observations = p.observations ? p.observations : "";
        if (p.status !== undefined && p.status !== null) {
            pp.status = p.status;
        }
        if (p.ownerid !== undefined && p.ownerid !== null) {
            pp.ownerid = p.ownerid;
        }
        if (p.reptype !== undefined && p.reptype !== null) {
            pp.reptype = p.reptype;
        }
        pp._storeable = true;
        pp._modified = false;
    } // convertBaseDoc
    private static _ConvertSigleNamedDoc(p: IItemSigleNamed, pp: ISigleNamedDoc) {
        ConvertData._ConvertBaseDoc(p, pp);
        pp.sigle = p.sigle ? p.sigle : "";
        pp.name = p.name ? p.name : "";
        pp._text = pp.name;
    } // ConvertSigleNamedDoc
    private static _ConvertControleChildDoc(
        p: IItemControleChild,
        pp: IControleChildDoc
    ) {
        ConvertData._ConvertBaseDoc(p, pp);
        pp.controleid = p.controleid ? p.controleid : "";
        pp.etudiantid = p.etudiantid ? p.etudiantid : "";
    } // convertControleChildDoc
    private static _ConvertBaseAffectationDoc(
        p: IItemBaseAffectation,
        pp: IAffectationBaseDoc
    ) {
        ConvertData._ConvertBaseDoc(p, pp);
        pp.startdate = p.startdate ? p.startdate : "";
        pp.enddate = p.enddate ? p.enddate : "";
        pp.anneeid = p.anneeid ? p.anneeid : "";
        pp.semestreid = p.semestreid ? p.semestreid : "";
        pp.groupeid = p.groupeid ? p.groupeid : "";
    } // convertBaseAffectationDoc
    private static _ConvertPersonDoc(p: IItemPerson, pp: IPersonDoc) {
        ConvertData._ConvertBaseDoc(p, pp);
        pp.username = p.username ? p.username : "";
        pp.password = p.password ? p.password : "";
        pp.firstname = p.firstname ? p.firstname : "";
        pp.lastname = p.lastname ? p.lastname.toUpperCase() : "";
        pp.email = p.email ? p.email : "";
        pp.phone = p.phone ? p.phone : "";
        pp.address = p.address ? p.address : "";
        pp.birthdate = p.birthdate ? p.birthdate : "";
        pp.sexe = p.sexe ? p.sexe : "";
        pp.roles = p.roles ? p.roles : [];
        pp.avatar = p.avatar ? p.avatar : "";
        pp._text = pp.lastname + " " + pp.firstname;
    } // convertPersonDoc
} // class ConvertData

function CreateFieldEvent() {
    throw new Error("Function not implemented.");
}

