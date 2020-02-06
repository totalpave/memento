
import * as api from '../src/api';
import {Originator} from '../src/Originator';
import {Memento} from '../src/Memento';
import {Changeset} from '../src/Changeset';

describe('Public API', () => {
    it('Originator', () => {
        expect(api.Originator).toBe(Originator);
    });
    
    it('Memento', () => {
        expect(api.Memento).toBe(Memento);
    });
    
    it('Changeset', () => {
        expect(api.Changeset).toBe(Changeset);
    });
});
