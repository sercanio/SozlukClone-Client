import { create } from 'zustand';

interface LoadingState {
  visible: boolean;
  showSpinnerOverlay: () => void;
  hideSpinnerOverlay: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  visible: false,
  showSpinnerOverlay: () => set({ visible: true }),
  hideSpinnerOverlay: () => set({ visible: false }),
}));

export default useLoadingStore;
