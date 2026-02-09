import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { FileBrowser } from './components/file-browser/FileBrowser'
import styles from './App.module.css'

const FolderRoute = () => {
  const { id } = useParams<{ id: string }>()

  const setCurrentFolder = useAppStore((state) => state.setCurrentFolder)
  const isLoading = useAppStore((state) => state.isLoading)
  const isInitialized = useAppStore((state) => state.isInitialized)
  const error = useAppStore((state) => state.error)
  const loadData = useAppStore((state) => state.loadData)

  useEffect(() => {
    if (!id) return
    const folderId = Number.parseInt(id, 10)
    if (Number.isNaN(folderId)) return
    setCurrentFolder(folderId)
  }, [id, setCurrentFolder])

  if (isLoading && !isInitialized) {
    return <div className={styles.centered}>Загрузка...</div>
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <p>{error}</p>
        <button type="button" onClick={() => loadData()}>
          Повторить
        </button>
      </div>
    )
  }

  return <FileBrowser />
}

const AppInner = () => {
  const rootId = useAppStore((state) => state.rootId)
  const isInitialized = useAppStore((state) => state.isInitialized)
  const loadData = useAppStore((state) => state.loadData)

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (!isInitialized) {
    return <div className={styles.centered}>Загрузка...</div>
  }

  if (rootId == null) {
    return <div className={styles.centered}>Корневая папка не найдена</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/folder/${rootId}`} replace />} />
      <Route path="/folder/:id" element={<FolderRoute />} />
      <Route path="*" element={<Navigate to={`/folder/${rootId}`} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <div className={styles.app}>
      <AppInner />
    </div>
  )
}

export default App
