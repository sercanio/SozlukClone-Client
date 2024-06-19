import { create } from 'zustand';

interface TriggerState {
    trigger: boolean;
    setTrigger: () => void;
}

export const useLeftFrameTrigger = create<TriggerState>((set) => ({
    trigger: false,
    setTrigger: () => set((state) => ({
        trigger: !state.trigger
    })),
}));
