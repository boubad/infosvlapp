// InfoDomain.ts
//
export interface IItemDoc {
    _id?: string;
    _rev?: string;
    _deleted?: boolean;
    _attachments?: any;
    doctype?: string;
    status?: number;
    tag?: string;
    observations?: string;
    ownerid?: string;
    reptype?: string;
} // interface IItemDoc
export interface IItemSigleNamed extends IItemDoc {
    sigle?: string;
    name?: string;
} // interface
export interface IItemGroupe extends IItemSigleNamed {
    semestreid?: string;
    parentid?: string;
    groupetype?: number;
} // interface IItemGroupe
export interface IItemSemestre extends IItemSigleNamed { } // interface IItemSemestre
export interface IItemUnite extends IItemSigleNamed { } // interface IItemUnite
export interface IItemAnnee extends IItemSigleNamed {
    startdate?: string;
    enddate?: string;
} // interface IItemAnnee
export interface IItemMatiere extends IItemSigleNamed {
    uniteid?: string;
    modname?: string;
    coefficient?: number;
    ecs?: number;
} // interface IItemMatiere
export interface IItemPerson extends IItemDoc {
    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    birthdate?: string;
    sexe?: string;
    roles?: string[];
    avatar?: string;
    address?: string;
} // interface IItemPerson
export interface IItemEtudiant extends IItemPerson {
    birthyear?: number;
    ident?: string;
    departement?: string;
    ville?: string;
    etablissement?: string;
    seriebac?: string;
    optionbac?: string;
    mentionbac?: string;
    apb?: number | null;
    sup?: string;
    redoublant?: string;
    typeformation?: string;
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
} // interface IItemEtudiant
export interface IItemRootAffectation extends IItemDoc {
    startdate?: string;
    enddate?: string;
    anneeid?: string;
    semestreid?: string;
} // interface IItemRootAffectation
export interface IItemBaseAffectation extends IItemRootAffectation {
    groupeid?: string;
} // interface IItemBaseAffectation
export interface IItemAffectation extends IItemBaseAffectation {
    matiereid?: string;
} // interface IItemAffectation
export interface IItemControle extends IItemDoc {
    groupecontroleid?: string;
    affectationid?: string;
    date?: string;
    name?: string;
    place?: string;
    duration?: string;
    coefficient?: number;
    controletype?: number;
    hasnotes?: boolean;
} // interface IItemControle
export interface IItemGroupeControles extends IItemSigleNamed {
    semestreid?: string;
    matiereid?: string;
} // interface IItemGroupeControles
export interface IItemEtudAffectation extends IItemBaseAffectation {
    etudiantid?: string;
} // interface IItemEtudAffectation
export interface IItemControleChild extends IItemDoc {
    controleid?: string;
    etudiantid?: string;
} // interface IItemControleChild
export interface IItemEvt extends IItemControleChild {
    evttype?: number;
    justifie?: boolean;
    duration?: string;
} // interface IItemEvt
export interface IItemNote extends IItemControleChild {
    value?: number | null;
} // interface IItemNote
export interface IItemFieldEvent extends IItemDoc {
    evttype?: number;
    value?: any;
} // interface IItemFieldEvent
