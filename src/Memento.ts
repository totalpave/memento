import { ObjectUtils } from '@totalpave/object';

// import {IMementoChangeset} from './IMementoChangeset';

export class Memento<T/*, K extends keyof T = keyof T*/> {
    private _data: T;
    // private _changesets: Array<IMementoChangeset> = [];

    public constructor(data: T) {
        this._data = ObjectUtils.clone(data);
    }

    public getState(): T {
        return ObjectUtils.clone(this._data);
    }
}
