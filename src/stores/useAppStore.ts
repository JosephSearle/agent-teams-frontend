import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createUiSlice, type UiSlice } from './slices/uiSlice'
import { createGraphSlice, type GraphSlice } from './slices/graphSlice'
import { createThreadSlice, type ThreadSlice } from './slices/threadSlice'

type AppStore = UiSlice & GraphSlice & ThreadSlice

export const useAppStore = create<AppStore>()(
  devtools(
    (...args) => ({
      ...createUiSlice(...args),
      ...createGraphSlice(...args),
      ...createThreadSlice(...args),
    }),
    { name: 'AgentTeamsStore' },
  ),
)
