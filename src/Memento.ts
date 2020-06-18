import { ObjectUtils } from '@totalpave/object';

/**
 * An object that holds a state at the moment of creation
 */
export class Memento<T> {
    private _data: T;

    public constructor(data: T) {
        this._data = ObjectUtils.clone(data);
    }

    public getState(): T {
        return ObjectUtils.clone(this._data);
    }
}
