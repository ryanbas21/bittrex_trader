//@ts-ignore
import { lensProp, set, view, over, compose } from 'ramda';

export const dataLens = lensProp('data');
export const resultLens = lensProp('result');
export const marketLens = compose(dataLens, resultLens) as R.Lens;
