import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Breadcrumbs } from './Breadcrumbs'
import { FileList } from './FileList'
import styles from './FileBrowser.module.css'

export const FileBrowser = () => {
  const store = useAppStore()
  const navigate = useNavigate()

  const rootId = useAppStore((state) => state.rootId)
  const { currentFolderId, getFolderChildren, getFolderPath, pendingFavoriteIds } = store

  const children = useMemo(
    () => getFolderChildren(currentFolderId),
    [getFolderChildren, currentFolderId],
  )

  const path = useMemo(
    () => getFolderPath(currentFolderId),
    [getFolderPath, currentFolderId],
  )

  const isRootFolder = rootId !== null && currentFolderId === rootId

  const handleOpenFolder = (id: number) => {
    store.setCurrentFolder(id)
    navigate(`/folder/${id}`)
  }

  const handleToggleFavorite = (id: number) => {
    void store.toggleFavorite(id)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.icon} aria-hidden="true">
          📁
        </div>
        <div className={styles.headerText}>
          {isRootFolder ? (
            <h1 className={styles.title}>Ваши файлы</h1>
          ) : (
            <Breadcrumbs items={path} onNavigate={handleOpenFolder} />
          )}
        </div>
      </header>

      <main className={styles.content}>
        <FileList
          items={children}
          onOpenFolder={handleOpenFolder}
          onToggleFavorite={handleToggleFavorite}
          pendingFavoriteIds={pendingFavoriteIds}
        />
      </main>
    </div>
  )
}

