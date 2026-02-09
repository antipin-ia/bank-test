import type { Item } from '../../models/Item'
import styles from './FileList.module.css'
import { FileListItem } from './FileListItem'

type Props = {
  items: Item[]
  onOpenFolder: (id: number) => void
  onToggleFavorite: (id: number) => void
  pendingFavoriteIds: Set<number>
}

export const FileList = ({ items, onOpenFolder, onToggleFavorite, pendingFavoriteIds }: Props) => {
  if (items.length === 0) {
    return <div className={styles.empty}>В этой папке пока нет файлов</div>
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <FileListItem
          key={item.id}
          item={item}
          onOpenFolder={onOpenFolder}
          onToggleFavorite={onToggleFavorite}
          isFavoritePending={pendingFavoriteIds.has(item.id)}
        />
      ))}
    </div>
  )
}
