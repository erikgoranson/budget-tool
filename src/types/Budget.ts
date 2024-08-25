
//child category: bills->mortgage, bills->cable, etc
export type Budget = {
    //categoryName: string,
    id: number,
    name: string,
    amount: number,
    dueDate: number | null,
    //foreignKey? or will this be nested in Category?
};