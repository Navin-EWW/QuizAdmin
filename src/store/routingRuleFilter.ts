import create from "zustand";

import { persist } from "zustand/middleware";
import { originDestionType } from "../types/routingRule";

export const useRoutingStore = create<routingFilter>()((set) => ({
  filterAllData: {},
  setDataAllFilter: (data: any) => set(() => ({ filterAllData: { ...data } })),
  removeAll: () =>
    set(() => ({
      filterAllData: {},
    })),
}));

export type routingFilter = {
  filterAllData: originDestionType | any;
  setDataAllFilter: (data: object) => void;
  removeAll: () => void;
};
