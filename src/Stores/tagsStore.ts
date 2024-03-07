import { create } from 'zustand';
import { Tags } from '../Consts/Tags';

type State = {
  tags: string[];
};
type Action = {
  updateTags: (tags: State['tags']) => void;
};

const useTagsStore = create<State & Action>((set) => ({
  tags: [...Tags],
  updateTags: (newTags: string[]) => set(() => ({ tags: newTags }))
}));

export default useTagsStore;
