import type { Item } from '../../models/Item'
import styles from './FileListItem.module.css'

type Props = {
  item: Item
  onOpenFolder: (id: number) => void
  onToggleFavorite: (id: number) => void
  isFavoritePending: boolean
}

export const FileListItem = ({ item, onOpenFolder, onToggleFavorite, isFavoritePending }: Props) => {
  const isDir = item.type === 'dir'

  const handlePrimaryClick = () => {
    if (isDir) {
      onOpenFolder(item.id)
    }
  }

  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onToggleFavorite(item.id)
  }

  return (
    <div
      className={`${styles.item} ${isDir ? styles.folder : styles.file}`}
      role={isDir ? 'button' : 'listitem'}
      tabIndex={isDir ? 0 : -1}
      onClick={handlePrimaryClick}
      onKeyDown={(event) => {
        if (!isDir) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenFolder(item.id)
        }
      }}
    >
      <div className={styles.main}>
        <span className={styles.icon} aria-hidden="true">
          {isDir ? '📁' : item.isImage() ? '🖼️' : '📄'}
        </span>
        <span className={styles.name}>{item.name}</span>
      </div>

      <button
        type="button"
        className={`${styles.favoriteButton} ${item.isFavorite ? styles.favoriteActive : ''}`}
        onClick={handleToggleFavorite}
        disabled={isFavoritePending}
        aria-pressed={item.isFavorite}
      >
        <span className={styles.favoriteIcon} aria-hidden="true">
          {item.isFavorite ? '★' : '☆'}
        </span>
        <span className={styles.favoriteLabel}>
          {item.isFavorite ? 'Убрать из избранного' : 'В избранное'}
        </span>
      </button>
    </div>
  )
}
