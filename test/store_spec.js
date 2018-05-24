import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import makeStore from '../src/store';

describe('store', () => {
  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({ type: 'SET_ENTRIES', entries: ['Test1', 'Test2'] });
    expect(store.getState()).to.equal(
      fromJS({
        entries: ['Test1', 'Test2']
      })
    );
  });
});
