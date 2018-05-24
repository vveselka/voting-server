import { List, Map } from "immutable";
import { expect } from "chai";

import { setEntries, next, vote } from "../src/core";

describe("application logic", () => {
  describe("setEntries", () => {
    it("adds entries to the state", () => {
      const state = new Map();
      const entries = List.of("Trainspotting", "28 Days Later");
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(
        Map({ entries: List.of("Trainspotting", "28 Days Later") })
      );
    });
  });

  it("converts to immutable", () => {
    const state = Map();
    const entries = ["Trainspotting", "28 Days Later"];
    const nextState = setEntries(state, entries);
    expect(nextState).to.equal(
      Map({
        entries: List.of("Trainspotting", "28 Days Later")
      })
    );
  });

  describe("next", () => {
    it("takes the next two entries under vote", () => {
      const state = Map({
        entries: List.of("Trainspotting", "28 Days Later", "Sunshine")
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Trainspotting", "28 Days Later")
          }),
          entries: List.of("Sunshine")
        })
      );
    });

    it("puts winner of current pair back to entries", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Test3", "Test4"),
          tally: Map({
            Test3: 3,
            Test4: 1
          })
        }),
        entries: List.of("Test1", "Test2", "Test5")
      });

      const nextState = next(state);

      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Test1", "Test2")
          }),
          entries: List.of("Test5", "Test3")
        })
      );
    });

    it("puts both from tied back to entries", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Test3", "Test4"),
          tally: Map({
            Test3: 3,
            Test4: 3
          })
        }),
        entries: List.of("Test1", "Test2", "Test5")
      });

      const nextState = next(state);

      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Test1", "Test2")
          }),
          entries: List.of("Test5", "Test3", "Test4")
        })
      );
    });

    it("marks winner when just one entry left", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Trainspotting", "28 Days Later"),
          tally: Map({
            Trainspotting: 4,
            "28 Days Later": 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          winner: "Trainspotting"
        })
      );
    });
  });

  describe("vote", () => {
    it("creates the tally for the vote", () => {
      const state = Map({
        pair: List.of("Test1", "Test2")
      });

      const nextState = vote(state, "Test1");
      expect(nextState).to.equal(
        Map({
          pair: List.of("Test1", "Test2"),
          tally: Map({ Test1: 1 })
        })
      );
    });

    it("adds to existing tally for the voted entry", () => {
      const state = Map({
        pair: List.of("Test1", "Test2"),
        tally: Map({ Test1: 1, Test2: 3 })
      });

      const newState = vote(state, "Test1");
      expect(newState).to.equal(
        Map({
          pair: List.of("Test1", "Test2"),
          tally: Map({ Test1: 2, Test2: 3 })
        })
      );
    });
  });
});
