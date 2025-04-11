import { v4 as uuidv4 } from 'uuid';

export const compareObjects = (originalValue: any, formInput: any) => {
    return JSON.stringify(originalValue) == JSON.stringify(formInput);
};

export const getOrAssignGuid = (guid: string) => {
    return (guid != '') ? guid : uuidv4();
};

export const baseProps = {
    onSubmitFunction: {
        type: Function as (...args: any) => any,
        required: false,
    },
};