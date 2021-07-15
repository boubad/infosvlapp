export interface ICouchDBFindResponse<T> {
    docs?: T[];
    warning?: string;
    execution_stats?: any;
    bookmark?: string;
  }