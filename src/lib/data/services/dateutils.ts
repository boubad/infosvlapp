import moment from "moment";
//////////////////////////////////////
export function DateToDisplay(date?: string): string {
    if (date !== undefined && date !== null && date.length > 0) {
        const dx = moment(date);
        if (dx.isValid()) {
            return dx.format("DD/MM/YYYY");
        }
    }
    return "";
} // DateToDisplay
export function DateStringToDate(date: string): Date | null {
    if (date !== undefined && date !== null && date.length > 0) {
        const dx = moment(date);
        if (dx.isValid()) {
            return dx.toDate();
        }
    }
    return null;
}
/////////////////////////////////////
