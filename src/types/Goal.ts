import { GoalOption } from "./GoalOption";

export type Goal = {
    id: string,
    amount: number,
    createdDate: string,
    targetDate: string,
    subcategoryId: string,
    goalOption: GoalOption,
    isComplete: boolean,
    currentAmount: number,
};