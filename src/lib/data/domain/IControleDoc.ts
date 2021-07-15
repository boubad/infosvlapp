import { ControleType } from './ControleType';
import { DomainConstants } from './DomainConstants';
import type { IBaseDoc } from './IBaseDoc';
import type { IEvtDoc } from './IEvtDoc';
import type { INoteDoc } from './INoteDoc';

export interface IControleDoc extends IBaseDoc {
    affectationid: string;
    controletype: ControleType;
    groupecontroleid: string;
    date: string;
    name: string;
    coefficient: number;
    place?: string;
    duration?: string;
    hasnotes: boolean;
    //
    _anneeSigle?: string;
    _semestreSigle?: string;
    _groupeSigle?: string;
    _matiereSigle?: string;
    _uniteSigle?: string;
    _matiereCoeff?: number;
    _groupeControlesSigle?:string;
    //
    _notes?: INoteDoc[];
    _evts?: IEvtDoc[];
    //
} // interface IControleDoc
export function CreateControle(affectationid?: string, groupecontroleid?: string): IControleDoc {
    return (
        {
            _id: "",
            _rev: "",
            controletype: ControleType.Unknown,
            affectationid: affectationid ? affectationid : "",
            groupecontroleid: groupecontroleid ? groupecontroleid : "",
            date: new Date().toISOString().slice(0, 10),
            name: "",
            coefficient: 1.0,
            hasnotes: true,
            doctype: DomainConstants.TYPE_CONTROLE,
            _linkfield: DomainConstants.FIELD_CONTROLEID,
        }
    );
} // GetInitialControle
//
export function GetControleTitle(p: IControleDoc): string {
    const s = (p._matiereSigle) ? p._matiereSigle.toUpperCase() + " - " : "";
    return s + p.date + " - " + p.name;
}//GetControleTitle
//
export const initialControle: IControleDoc = CreateControle();
