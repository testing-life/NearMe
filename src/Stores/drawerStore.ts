import { create } from 'zustand';

type State = {
  isOpen: boolean;
};
type Action = {
  toggleDrawer: (isOpen: State['isOpen']) => void;
};

const useDrawerStore = create<State & Action>((set) => ({
  isOpen: false,
  toggleDrawer: (isOpen: boolean) => set(() => ({ isOpen: !isOpen }))
}));

export default useDrawerStore;
