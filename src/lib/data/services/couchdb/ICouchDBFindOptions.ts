export interface ICouchDBFindOptions {
    selector: any;
    limit?: number;
    skip?: number;
    sort?: any[];
    fields?: string[];
    use_index?: string | string[];
    r?: number;
    bookmark?: string;
    update?: boolean;
    stable?: boolean;
    stale?: string;
    execution_stats?: boolean;
  }
  