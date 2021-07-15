// IBaseDoc.ts
//

import type { StatusType } from "./StatusType";
import type { IAttachedDoc } from "./IAttachedDoc";

//
export interface IBaseDoc {
    _id: string;
    _rev: string;
    doctype: string;
    observations?: string;
    status?: StatusType;
    ownerid?: string;
    reptype?: string;
    _attachments?: IAttachedDoc[];
    _loaded?: boolean;
    _modified?: boolean;
    _deleted?: boolean;
    _storeable?: boolean;
    _selected?: boolean;
    _text?: string;
    _linkfield?: string;
} // interface IBaseDoc
