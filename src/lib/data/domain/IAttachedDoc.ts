//IAttachedDoc.ts
//
export interface IAttachedDoc {
    content_type: string;
    data?: string;
    digest?: string;
    encoded_length?: number;
    encoding?: string;
    length?: number;
    revpos?: number;
    stub?: boolean;
    url?:string;
    name?:string;
    docid?:string;
    imgData?:ArrayBuffer;
  } // interface IAttachedDoc
  