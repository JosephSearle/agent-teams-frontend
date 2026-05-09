import type { StateCreator } from 'zustand'
import type { Layout } from '@/types'

export interface UiSlice {
  layout: Layout
  adminMode: boolean
  modalOpen: boolean
  setLayout: (v: Layout) => void
  setAdminMode: (v: boolean) => void
  toggleAdminMode: () => void
  setModalOpen: (v: boolean) => void
}

export const createUiSlice: StateCreator<UiSlice, [['zustand/devtools', never]], [], UiSlice> = (
  set,
) => ({
  layout: 'three-panel',
  adminMode: false,
  modalOpen: false,

  setLayout: (v) => set({ layout: v }, undefined, 'ui/setLayout'),
  setAdminMode: (v) => set({ adminMode: v }, undefined, 'ui/setAdminMode'),
  toggleAdminMode: () => set((s) => ({ adminMode: !s.adminMode }), undefined, 'ui/toggleAdminMode'),
  setModalOpen: (v) => set({ modalOpen: v }, undefined, 'ui/setModalOpen'),
})
