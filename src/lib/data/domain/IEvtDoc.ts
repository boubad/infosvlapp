// IEvtDoc.ts
//
import { DomainConstants } from './DomainConstants';
import { EvtType } from './EvtType';
import type { IControleChildDoc } from './IControleChildDoc';

export interface IEvtDoc extends IControleChildDoc {
    evttype: EvtType;
    duration?: string;
    justifie?: boolean;
} // interface IEvtDoc
export function CreateEvt(controleid?: string, etudiantid?: string): IEvtDoc {
    return (
        {
            _id: "",
            _rev: "",
            evttype: EvtType.Inconnu,
            controleid: controleid ? controleid : "",
            etudiantid: etudiantid ? etudiantid : "",
            doctype: DomainConstants.TYPE_EVT,
            _linkfield: DomainConstants.FIELD_EVTID,
        }
    );
} // GetInitialEvt
//
export const initialEvt: IEvtDoc = CreateEvt();
