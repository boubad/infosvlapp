// IControleChildDoc.ts
//

import type { IBaseDoc } from "./IBaseDoc";

export interface IControleChildDoc extends IBaseDoc {
    controleid: string;
    etudiantid: string;
    //
    _anneeSigle?: string;
    _semestreSigle?: string;
    _matiereSigle?: string;
    _groupeSigle?:string;
    _controleCoeff?: number;
    _matiereCoeff?: number;
    _uniteSigle?: string;
    _firstname?: string;
    _lastname?: string;
    _fullname?: string;
    _avatar?: string;
    _url?: string;
    _controleName?: string;
    _date?: string;
    _photoData?: ArrayBuffer;
    _groupeControlesSigle?:string;
} // interface IControleChildDoc
