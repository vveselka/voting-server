import { Map, fromJS } from "immutable";

import { expect } from "chai";

import reducer from "../src/reducer";

describe("reducer", () => {
  it("handles SET_ENTRIES", () => {
    const initialState = new Map();
    const action = { type: "SET_ENTRIES", entries: ["Test1"] };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({ entries: ["Test1"] }));
  });

  it("handles NEXT", () => {
    const initialState = fromJS({
      entries: ["Trainspotting", "28 Days Later"]
    });
    const action = { type: "NEXT" };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(
      fromJS({
        vote: {
          pair: ["Trainspotting", "28 Days Later"]
        },
        entries: []
      })
    );
  });

  it("handles VOTE", () => {
    const initialState = fromJS({
      vote: {
        pair: ["Trainspotting", "28 Days Later"]
      },
      entries: []
    });
    const action = { type: "VOTE", entry: "Trainspotting" };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(
      fromJS({
        vote: {
          pair: ["Trainspotting", "28 Days Later"],
          tally: { Trainspotting: 1 }
        },
        entries: []
      })
    );
  });

  it("has an initial state", () => {
    const action = { type: "SET_ENTRIES", entries: ["Trainspotting"] };
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(
      fromJS({
        entries: ["Trainspotting"]
      })
    );
  });

  it("can be used with reduce", () => {
    const actions = [
      {
        type: "SET_ENTRIES",
        entries: ["Trainspotting", "28 Days Later", "OLOLO"]
      },
      { type: "NEXT" },
      { type: "VOTE", entry: "Trainspotting" },
      { type: "VOTE", entry: "28 Days Later" },
      { type: "VOTE", entry: "Trainspotting" },
      { type: "NEXT" },
      { type: "VOTE", entry: "Trainspotting" },
      { type: "NEXT" }
    ];
    const finalState = actions.reduce(reducer, Map());
    console.log("_________________");
    console.log(finalState);

    expect(finalState).to.equal(
      fromJS({
        winner: "Trainspotting"
      })
    );
  });
});
