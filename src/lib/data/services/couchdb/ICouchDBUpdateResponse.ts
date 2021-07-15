// CouchDBDefs.ts

  export interface ICouchDBUpdateResponse {
    id?: string;
    rev?: string;
    ok?: boolean;
    error?: string;
    reason?: string;
  }
  