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
    id: zod.string().default(uuidv4()),
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
  const goalAlreadyExists = ('goalOption' in original);
  const valuesMatch = compareObjects(userInput, original);

  if (goalAlreadyExists)
  {
    if (!valuesMatch)
    {
      const mergedValues: Goal = { ...original, ...userInput }; 
      console.log('existing values', JSON.stringify(original, null, 2));
      console.log('new values', JSON.stringify(userInput, null, 2));
      console.log('MERGED values', JSON.stringify(mergedValues, null, 2));

      goalStore.updateGoal(mergedValues);
    }
  }
  else 
  {
    const newGoal = <Goal>{
      id: userInput.id,
      amount: userInput.amount,
      targetDate: userInput.targetDate,
      createdDate: userInput.createdDate,
      subcategoryId: userInput.subcategoryId,
      goalOption: userInput.goalOption,
      isComplete: userInput.isComplete,
    };
    console.log('new goal is', JSON.stringify(newGoal, null, 2));
    goalStore.createGoal(newGoal);
  }
};
