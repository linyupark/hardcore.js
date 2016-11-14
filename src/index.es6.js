
import o from "./pattern/observable.es.js";
import s from "./pattern/singleton.es6.js";

const HC = class {};
HC.observable = o.observable;
HC.createSingleton = s.createSingleton;


export {HC};