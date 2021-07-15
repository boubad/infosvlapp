import type { IBaseDoc } from "../domain/IBaseDoc";
import type { IDataOption } from "../domain/IDataOption";

export interface IItemPayload<T extends IBaseDoc> {
    error?: string;
    info?: string;
    result?: boolean;
    dataoptions?: IDataOption[],
    items?: IDataOption[];
    item?: T;
    prev?: T,
    page?: number;
    itemsCount?: number;
    pagesCount?: number;
    pageSize?: number;
    filter?: any;
    field?: string;
    value?: any;
    genre?: any;
    id?: string;
    //
} // interface IItemPayload<T>
