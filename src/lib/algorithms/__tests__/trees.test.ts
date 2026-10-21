import { describe, expect, it } from "vitest";
import {
  bstHeight,
  bstInOrderSteps,
  bstInsertSteps,
  bstSearchSteps,
  buildBSTFromArray,
} from "../trees";

describe("BST algorithm engine", () => {
  const tree = buildBSTFromArray([50, 30, 70, 20, 40, 60, 80]);

  it("builds a linked, positioned BST", () => {
    expect(tree.root).toBe(50);
    expect(tree.nodes.get(50)?.left).toBe(30);
    expect(tree.nodes.get(50)?.right).toBe(70);
    expect(tree.nodes.get(20)?.depth).toBe(2);
    expect(bstHeight(tree)).toBe(3);
  });

  it("traces insertion without mutating the starting state", () => {
    const steps = bstInsertSteps(tree, 35);
    const result = steps.at(-1)?.state;

    expect(steps.map((step) => step.type)).toContain("compare");
    expect(result?.nodes.get(40)?.left).toBe(35);
    expect(tree.nodes.has(35)).toBe(false);
  });

  it("finds values and returns ordered traversal steps", () => {
    expect(bstSearchSteps(tree, 60).at(-1)?.type).toBe("found");
    expect(bstSearchSteps(tree, 99).at(-1)?.type).toBe("not-found");
    expect(bstInOrderSteps(tree).filter((step) => step.type === "visit").map((step) => step.nodeId))
      .toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
