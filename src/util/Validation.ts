/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

/**
 * Converts a POGO into a new class type
 * @param pogo Plain Old Javascript Object
 * @param classType class to be coerced into
 */
export const transformToClass = function (pogo: any, classType: any) {
    return plainToClass(classType, pogo);
};

/**
 * Converts a POGO into a new class type with validation
 * @param pogo Plain Old Javascript Object
 * @param classType class to be coerced into
 */
export const transformAndValidate = async function (pogo: any, classType: any) {
    const result = transformToClass(pogo, classType);
    await validateOrReject(result);
    return result;
};