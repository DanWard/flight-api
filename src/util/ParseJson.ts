/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

/**
 * Thanks to https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
 */

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
const parserExtension = function (key: any, value: any) {
    if (typeof value === "string") {
        let a = reISO.exec(value);
        if (a)
            return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            const b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
};

/**
 * Transforms a JSON string into a JS object with date parsing
 * @param json JSON string input
 */
export const parseJson = function (json: string) {
    return JSON.parse(json, parserExtension);
};

/**
 * Extends the normal parsing by also converting the object into a valid class
 * @param json JSON string input
 * @param classType class to be coerced into
 */
export const parseJsonAsClass = function (json: string, classType: any) {
    const parsed = parseJson(json);
    return plainToClass(classType, parsed);
};

/**
 * Parses, transforms, and validates a JSON input string against a given class with validation
 * @param json JSON string input
 * @param classType class to be coerced into
 */
export const parseJsonAndValidate = async function (json: string, classType: any) {
    const result = parseJsonAsClass(json, classType);
    await validateOrReject(result);
    return result;
};