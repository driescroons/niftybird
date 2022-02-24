import create from "zustand";
import produce from "immer";

export const answers = ["fancy", "woody", "spelt", "comet", "drone", "scarf"];

export const useStore = create((set) => ({
  colors: [],
  img: null,
  isPlaying: false,
  scores: [],
  set: (store) => set(produce(store)),
}));