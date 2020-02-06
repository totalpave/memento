
import {Memento} from './Memento';
import {ObjectUtils} from '@totalpave/object';
import { Changeset } from './Changeset';

// https://en.wikipedia.org/wiki/Memento_pattern

export class Originator<T, K extends keyof T = keyof T> {
    private _data: T;
    private _transaction: Memento<T>;

    public constructor(data: T) {
        this._data = ObjectUtils.clone(data);
        this._transaction = null;
    }

    public save(): Memento<T> {
        return new Memento<T>(this._data);
    }

    public restore(memento: Memento<T>): void {
        this._data = memento.getState();
    }

    public revert(changeset: Changeset<T, K>): Changeset<T, K> {
        return this.set(changeset.getKey(), changeset.getOldValue());
    }

    public set(key: K, value: T[K]): Changeset<T, K> {
        let oldValue: T[K] = this.get(key);
        this._data[key] = value;
        return new Changeset<T, K>(key, oldValue, value);
    }

    public get(key: K): T[K] {
        return this._data[key];
    }

    public startTransaction(): void {
        if (this._transaction === null) {
            this._transaction = this.save();
        }
    }

    public isTransaction(): boolean {
        return this._transaction !== null;
    }

    public commit(): void {
        this._transaction = null;
    }

    public rollback(): void {
        this.restore(this._transaction);
        this._transaction = null;
    }

    public getData(): T {
        if (this.isTransaction()) {
            // A non-committed transaction should return the original copy.
            let original: Originator<T, K> = new Originator<T, K>(null);
            original.restore(this._transaction);
            return original.getData();
        }
        else {
            return ObjectUtils.clone(this._data);
        }
    }
}
