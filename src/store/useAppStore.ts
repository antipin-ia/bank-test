import { create } from 'zustand'
import { Item, type RawItem } from '../models/Item'
import { SERVER_ITEMS } from '../mocks/serverData'

type ItemsMap = Map<number, Item>

type AppState = {
  items: Item[]
  itemsById: ItemsMap
  rootId: number | null
  currentFolderId: number | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  pendingFavoriteIds: Set<number>

  loadData: () => Promise<void>
  setCurrentFolder: (id: number | null) => void
  toggleFavorite: (id: number) => Promise<void>
  getFolderChildren: (folderId: number | null) => Item[]
  getFolderPath: (folderId: number | null) => Item[]
}

const buildItems = (rows: RawItem[]): { items: Item[]; itemsById: ItemsMap; rootId: number | null } => {
  const items = rows.map((row) => new Item(row))
  const itemsById: ItemsMap = new Map()

  for (const item of items) {
    itemsById.set(item.id, item)
  }

  let rootId: number | null = null

  for (const item of items) {
    if (item.parentId == null) {
      if (rootId == null) {
        rootId = item.id
      }
      continue
    }

    const parent = itemsById.get(item.parentId)
    if (parent) {
      parent.children.push(item)
    }
  }

  return { items, itemsById, rootId }
}

export const useAppStore = create<AppState>((set, get) => ({
  items: [],
  itemsById: new Map(),
  rootId: null,
  currentFolderId: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  pendingFavoriteIds: new Set(),

  async loadData() {
    const { isInitialized } = get()
    if (isInitialized) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const simulateRequest = () =>
        new Promise<RawItem[]>((resolve) => {
          setTimeout(() => resolve(SERVER_ITEMS), 500)
        })

      const rows = await simulateRequest()

      const { items, itemsById, rootId } = buildItems(rows)

      set({
        items,
        itemsById,
        rootId,
        currentFolderId: rootId,
        isInitialized: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Не удалось загрузить данные',
        isLoading: false,
      })
    }
  },

  setCurrentFolder(id) {
    set({ currentFolderId: id })
  },

  async toggleFavorite(id) {
    const { pendingFavoriteIds, itemsById } = get()

    if (pendingFavoriteIds.has(id)) {
      return
    }

    const target = itemsById.get(id)
    if (!target) {
      return
    }

    const newValue = !target.isFavorite

    const nextPending = new Set(pendingFavoriteIds)
    nextPending.add(id)
    set({ pendingFavoriteIds: nextPending })

    try {
      const simulateRequest = () =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 400)
        })

      const { items } = get()

      target.isFavorite = newValue

      const updatedItems = items.map((item) => (item.id === id ? target : item))

      set({ items: updatedItems, itemsById })

      await simulateRequest()
    } catch (error) {
      console.error(error)
    } finally {
      const { pendingFavoriteIds: currentPending } = get()
      const updatedPending = new Set(currentPending)
      updatedPending.delete(id)
      set({ pendingFavoriteIds: updatedPending })
    }
  },

  getFolderChildren(folderId) {
    const { itemsById } = get()

    if (folderId == null) {
      return []
    }

    const folder = itemsById.get(folderId)
    if (!folder) {
      return []
    }

    return folder.children.slice().sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  },

  getFolderPath(folderId) {
    const { itemsById } = get()
    if (folderId == null) {
      return []
    }

    const path: Item[] = []
    let current: Item | undefined = itemsById.get(folderId)

    while (current) {
      path.unshift(current)
      if (current.parentId == null) {
        break
      }
      current = itemsById.get(current.parentId)
    }

    return path
  },
}))
