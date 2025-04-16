import type { Budget } from "./Budget";
import { GoalOption } from "./GoalOption";

export interface Goal extends Budget {
    goalOption: GoalOption,
};