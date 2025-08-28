import { create } from 'zustand';

export type BlockType = 'title' | 'text' | 'image';

export type Block = {
  id: string;
  type: BlockType;
  title?: string;
  text?: string;
  imageUri?: string;
};

type State = {
  category: string | null;
  blocks: Block[];
  /** 서버에 업로드 후 반환되는 글 id */
  serverId: string | null;

  /** 카드 배경색 (색상 선택 화면에서 설정) */
  cardColor: string | null;

  /** 대표 사진(커버) URI — AddPhotoScreen 에서 설정 */
  photoUri: string | null;

  setCategory: (c: string | null) => void;
  setBlocks: (bs: Block[]) => void;
  addBlock: (t: BlockType) => void;
  removeBlock: (id: string) => void;
  moveBlock: (from: number, to: number) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;

  /** 서버 id 저장/초기화 */
  setServerId: (id: string | null) => void;

  /** 카드 배경색 저장/초기화 */
  setCardColor: (c: string | null) => void;

  /** 대표 사진(커버) 저장/초기화 */
  setPhotoUri: (u: string | null) => void;

  reset: () => void;
};

const makeId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const usePostDraftStore = create<State>((set, get) => ({
  category: null,
  blocks: [],
  serverId: null,
  cardColor: null,
  photoUri: null,

  setCategory: (c) => set({ category: c }),
  setBlocks: (bs) => set({ blocks: bs }),
  addBlock: (t) => set({ blocks: [...get().blocks, { id: makeId(), type: t }] }),
  removeBlock: (id) => set({ blocks: get().blocks.filter((b) => b.id !== id) }),
  moveBlock: (from, to) => {
    const arr = [...get().blocks];
    if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return;
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    set({ blocks: arr });
  },
  updateBlock: (id, patch) =>
    set({
      blocks: get().blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }),

  setServerId: (id) => set({ serverId: id }),

  setCardColor: (c) => set({ cardColor: c }),

  setPhotoUri: (u) => set({ photoUri: u }),

  reset: () =>
    set({
      category: null,
      blocks: [],
      serverId: null,
      cardColor: null,
      photoUri: null,
    }),
}));
