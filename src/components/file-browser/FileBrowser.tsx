import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export const FileBrowser = () => {
  const store = useAppStore()
  const navigate = useNavigate()

  const { currentFolderId, getFolderChildren } = store

  const children = useMemo(
    () => getFolderChildren(currentFolderId),
    [getFolderChildren, currentFolderId],
  )

  const handleOpenFolder = (id: number) => {
    store.setCurrentFolder(id)
    navigate(`/folder/${id}`)
  }

  return (
    <div>
      <h1>Ваши файлы</h1>
      <ul>
        {children.map((item) => (
          <li key={item.id}>
            {item.type === 'dir' ? (
              <button type="button" onClick={() => handleOpenFolder(item.id)}>
                [DIR] {item.name}
              </button>
            ) : (
              <span>
                [FILE] {item.name} {item.isFavorite ? '★' : ''}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

