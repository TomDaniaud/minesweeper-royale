import { create } from "zustand";
//cette fonction permet de créer un store zustand
// cela permet de créer un contexte pour le client de maniere a pouvoir acceder a 
// des données partagées entre les composants partout dans le code (ex: le score d'un jeu)
interface CounterState {
    count: number;
    increase: () => void;
    decrease: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
}));
