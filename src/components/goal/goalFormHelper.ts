import type { Goal, BudgetRow } from '@/types';
import { GoalOption } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useGoalStore } from '@/stores/goal';
import { compareObjects, baseProps } from '@/helpers/baseFormHelper';

export const formProps = {
    ...baseProps,
    input : {
        type: Object as () => BudgetRow | Goal,
        required: false,
        default: {} as Goal, 
    }, 
};

export const goalOptionKeys = Object.keys(GoalOption) as [keyof typeof GoalOption];

export const validationSchema = toTypedSchema(
  zod.object({
    id: zod.string().default(() => uuidv4()),
    amount: zod.number(),
    createdDate: zod.string().default(today(getLocalTimeZone()).toString()),
    targetDate: zod.string(),
    subcategoryId: zod.string({ required_error: 'You must select an existing budget category to which this goal will be assigned' }),
    goalOption: zod.enum(goalOptionKeys).default(GoalOption.Savings),
    isComplete: zod.boolean().default(false),
  })
);

export const handleSubmission = (userInput: any, original: Goal | BudgetRow) => {
  const goalStore = useGoalStore();
  const mergedValues: Goal = { ...original, ...userInput }
  goalStore.putGoal(mergedValues);
};
