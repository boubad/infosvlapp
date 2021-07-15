import type { INoteDoc } from './INoteDoc';
import type { IEvtDoc } from './IEvtDoc';
import type { IEtudAffectationDoc } from './IEtudAffectationDoc';
import type { IPersonDoc } from './IPersonDoc';
import { DomainConstants } from './DomainConstants';

export interface IEtudiantDoc extends IPersonDoc {
    birthyear?: number;
    ident?: string;
    departement?: string;
    ville?: string;
    etablissement?: string;
    seriebac?: string;
    optionbac?: string;
    mentionbac?: string;
    apb?: number | null;
    redoublant?: string;
    typeformation?: string;
    sup?: string;
    notedirty?: boolean;
    evtdirty?: boolean;
    data?: any | null;
    s0?: any | null;
    s1?: any | null;
    s2?: any | null;
    s3?: any | null;
    s4?: any | null;
    s5?: any | null;
    s6?: any | null;
    //
    _notes?: INoteDoc[];
    _evts?: IEvtDoc[];
    _affectations?: IEtudAffectationDoc[];
} // interface IEtudiantDoc
export function CreateEtudiant(): IEtudiantDoc {
    return ({
        _id: "",
        _rev: "",
        firstname: "",
        lastname: "",
        doctype: DomainConstants.TYPE_ETUDIANT,
        _linkfield: DomainConstants.FIELD_ETUDIANTID,
    });
} // GetInitialEtudiant
//
export const initialEtudiant: IEtudiantDoc = CreateEtudiant();
