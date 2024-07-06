import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import {  Pair } from "../generated/schema"

export function plusBigInt(originalVal: BigInt | null, addedVal: BigInt | null): BigInt {
    if (originalVal && addedVal) {
        return originalVal.plus(addedVal)
    }
    else if (addedVal && !originalVal) {
        return addedVal
    }
    else if (originalVal && !addedVal) {
        return originalVal
    }
    else {
        return BigInt.fromI32(0)
    }
}


export function arraySubtraction(original:BigInt[],itemsToRemove:BigInt[]):BigInt[]{
    let result = original;
    for (let i = 0; i < itemsToRemove.length; i++) {
        const element = itemsToRemove[i];
        const index = result.indexOf(element);
        if(index!==-1){
            result.splice(index,1);
        }
    }
    return result;
}
export function arrayTrim(original:BigInt[],numItems:BigInt):BigInt[]{
    let result = original;
    for (let i = BigInt.fromString("0"); i.lt(numItems); i=i.plus(BigInt.fromString("1"))) {
        if(result.length>0)
            result.pop();
    }
    return result;
}
export function arrayTrimed(original:BigInt[],numItems:BigInt):BigInt[]{
    let result = new Array<BigInt>();
    for (let i = BigInt.fromString("0"); i.lt(numItems); i=i.plus(BigInt.fromString("1"))) {
        if(original.length>0)
            result.push(original.pop())
    }
    return result;
}
export function arrayAddition(original:BigInt[],itemsToAdd:BigInt[]):BigInt[]{
    let result = original;
    for (let i = 0; i < itemsToAdd.length; i++) {
        const element = itemsToAdd[i];
        const index = result.indexOf(element);
        if(index===-1){
            result.push(element)        
        }
    }
    return result;
}

export function plusBigDecimal(originalVal: BigInt | null, addedVal: BigDecimal | null): BigInt {
    if (originalVal && addedVal) {
        return originalVal.toBigDecimal().plus(addedVal).digits
    }
    else if (addedVal && !originalVal) {
        return addedVal.digits
    }
    else if (originalVal && !addedVal) {
        return originalVal
    }
    else {
        return BigInt.fromString('0')
    }
}
export function timesBigDecimal(originalVal: BigDecimal | null, multipliedValue: BigDecimal | null): BigDecimal {
    if (originalVal && multipliedValue) {
        return originalVal.times(multipliedValue)
    }
    else {
        return BigInt.fromString('0').toBigDecimal()
    }
}




export function returnNonNullBigInt(originalVal: BigInt | null): BigInt {
    if (originalVal) {
        return originalVal
    }
    else {
        return BigInt.fromI32(0)
    }
}