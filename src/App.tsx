import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { FileBrowser } from './components/file-browser/FileBrowser'
import styles from './App.module.css'

const FolderRoute = () => {
  const { id } = useParams<{ id: string }>()
  const store = useAppStore()

  useEffect(() => {
    void store.loadData()
  }, [store])

  useEffect(() => {
    if (!id) return
    const folderId = Number.parseInt(id, 10)
    if (Number.isNaN(folderId)) return
    store.setCurrentFolder(folderId)
  }, [id, store])

  if (store.isLoading && !store.isInitialized) {
    return <div className={styles.centered}>Загрузка...</div>
  }

  if (store.error) {
    return (
      <div className={styles.centered}>
        <p>{store.error}</p>
        <button type="button" onClick={() => store.loadData()}>
          Повторить
        </button>
      </div>
    )
  }

  return <FileBrowser />
}

const AppInner = () => {
  const { rootId, isInitialized, loadData } = useAppStore()

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
