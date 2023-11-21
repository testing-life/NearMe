import { create } from 'zustand';

type State = {
  tags: string[];
};
type Action = {
  updateTags: (tags: State['tags']) => void;
};

const useTagsStore = create<State & Action>((set) => ({
  tags: [],
  updateTags: (newTags: string[]) => set(() => ({ tags: newTags }))
}));

export default useTagsStore;
