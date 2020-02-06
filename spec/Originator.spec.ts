
import {Originator} from '../src/Originator';
import { Memento } from '../src/Memento';
import { Changeset } from '../src/Changeset';

interface ITestData {
    firstName: string;
    lastName: string;
    age: number;
}

describe('Originator', () => {
    let originator: Originator<ITestData> = null;

    let originalDataset: ITestData = {
        firstName: 'John',
        lastName: 'Smith',
        age: 30
    };
    
    beforeEach(() => {
        originator = new Originator<ITestData>(originalDataset);
    });
    
    it('can set data', () => {
        originator.set('firstName', 'Norman');
        expect(originator.get('firstName')).toBe('Norman');
    });

    it('receives changesets', () => {
        let change: Changeset<ITestData> = originator.set('firstName', 'Norman');
        expect(change.getKey()).toBe('firstName');
        expect(change.getOldValue()).toBe('John');
        expect(change.getValue()).toBe('Norman');
    });

    it('can store to original state', () => {
        let state1: Memento<ITestData> = originator.save();
        originator.set('firstName', 'Norman');
        expect(originator.get('firstName')).toBe('Norman');
        originator.restore(state1);
        expect(originator.get('firstName')).toBe('John');
    });

    it('can revert changeset', () => {
        let firstNameChange: Changeset<ITestData> = originator.set('firstName', 'Norman');
        let lastNameChange: Changeset<ITestData> = originator.set('lastName', 'Breau');
        
        expect(originator.get('firstName')).toBe('Norman');
        expect(originator.get('lastName')).toBe('Breau');

        originator.revert(firstNameChange);
        expect(originator.get('firstName')).toBe('John');
        expect(originator.get('lastName')).toBe('Breau');

        originator.revert(lastNameChange);
        expect(originator.get('firstName')).toBe('John');
        expect(originator.get('lastName')).toBe('Smith');
    });

    describe('Transactions', () => {
        it('start transaction should call save', () => {
            spyOn(originator, 'save');
            originator.startTransaction();
            expect(originator.save).toHaveBeenCalled();
        });

        it('start transaction should\'t call save if called a second time', () => {
            spyOn(originator, 'save');
            originator.startTransaction();
            originator.startTransaction();
            expect(originator.save).toHaveBeenCalledTimes(1);
        });

        it('isTransaction to be true', () => {
            originator.startTransaction();
            expect(originator.isTransaction()).toBe(true);
        });

        it('isTransaction to be false', () => {
            expect(originator.isTransaction()).toBe(false);
        });

        it('can commit', () => {
            let expectation: ITestData = {
                firstName: 'Norman',
                lastName: 'Breau',
                age: 30
            };

            originator.startTransaction();
            originator.set('firstName', 'Norman');
            originator.set('lastName', 'Breau');
            originator.commit();

            expect(originator.getData()).toEqual(expectation);
        });

        it('can rollback', () => {
            originator.startTransaction();
            originator.set('firstName', 'Norman');
            originator.set('lastName', 'Breau');
            spyOn(originator, 'restore').and.callThrough();
            originator.rollback();
            expect(originator.restore).toHaveBeenCalled();
            expect(originator.isTransaction()).toBe(false);
            expect(originator.getData()).not.toBe(originalDataset);
        });

        describe('getData', () => {
            it('should return the original dataset', () => {
                expect(originator.getData()).toEqual(originalDataset);
            });

            it('should return a copy of the dataset', () => {
                expect(originator.getData()).not.toBe(originalDataset);
            });

            it('should return a pre-transaction dataset if transaction is not committed', () => {
                originator.startTransaction();
                originator.set('firstName', 'Norman');
                originator.set('lastName', 'Breau');
                expect(originator.getData()).not.toBe(originalDataset);
            });
        });
    });
});
