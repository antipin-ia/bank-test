import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Breadcrumbs } from './Breadcrumbs'
import { FileList } from './FileList'
import styles from './FileBrowser.module.css'

export const FileBrowser = () => {
  const navigate = useNavigate()

  const rootId = useAppStore((state) => state.rootId)
  const currentFolderId = useAppStore((state) => state.currentFolderId)
  const getFolderChildren = useAppStore((state) => state.getFolderChildren)
  const getFolderPath = useAppStore((state) => state.getFolderPath)
  const pendingFavoriteIds = useAppStore((state) => state.pendingFavoriteIds)
  const setCurrentFolder = useAppStore((state) => state.setCurrentFolder)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

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
    setCurrentFolder(id)
    navigate(`/folder/${id}`)
  }

  const handleToggleFavorite = (id: number) => {
    void toggleFavorite(id)
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

