import { DomainConstants } from "./DomainConstants";
import type { IAffectationBaseDoc } from "./IAffectationBaseDoc";

export interface IEtudAffectationDoc extends IAffectationBaseDoc {
    etudiantid: string;
    _lastname?: string;
    _firstname?: string;
    _fullname?: string;
    _avatar?: string;
    _url?: string;
    _photoData?: ArrayBuffer;
}
export function CreateEtudAffectation(anneeid?: string, semestreid?: string, groupeid?: string, etudiantid?: string): IEtudAffectationDoc {
    return (
        {
            _id: "",
            _rev: "",
            anneeid: anneeid ? anneeid : "",
            semestreid: semestreid ? semestreid : "",
            groupeid: groupeid ? groupeid : "",
            etudiantid: etudiantid ? etudiantid : "",
            doctype: DomainConstants.TYPE_ETUDAFFECTATION,
            _linkfield: DomainConstants.FIELD_ETUDIANTID,
        }
    );
} // GetInitialEtudAffectation
export const initialEtudAffectation: IEtudAffectationDoc = CreateEtudAffectation();
