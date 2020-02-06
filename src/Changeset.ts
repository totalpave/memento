
export class Changeset<T, K extends keyof T = keyof T> {
    private _oldValue: T[K];
    private _value: T[K];
    private _key: K;

    public constructor(key: K, oldValue: T[K], value: T[K]) {
        this._oldValue = oldValue;
        this._value = value;
        this._key = key;
    }

    public getKey(): K {
        return this._key;
    }

    public getValue(): T[K] {
        return this._value;
    }

    public getOldValue(): T[K] {
        return this._oldValue;
    }
}
