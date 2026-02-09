import type { RawItem } from '../models/Item'

export const SERVER_ITEMS: RawItem[] = [
  {
    id: 1,
    type: 'dir',
    parentId: null,
    name: 'Ваши файлы',
    isFavorite: false,
  },
  { id: 2, type: 'dir', parentId: 1, name: 'second', isFavorite: false },
  { id: 3, type: 'dir', parentId: 1, name: 'test', isFavorite: true },
  { id: 4, type: 'dir', parentId: 1, name: 'third', isFavorite: false },
  { id: 5, type: 'file', parentId: 1, name: 'photo.jpg', isFavorite: true },
  {
    id: 6,
    type: 'dir',
    parentId: 2,
    name: 'Вложенная папка',
    isFavorite: false,
  },
  {
    id: 7,
    type: 'dir',
    parentId: 6,
    name: 'Глубокое вложение',
    isFavorite: false,
  },
]
