import type { Item } from '../../models/Item'
import styles from './Breadcrumbs.module.css'

type Props = {
  items: Item[]
  onNavigate: (id: number) => void
}

export const Breadcrumbs = ({ items, onNavigate }: Props) => {
  if (items.length === 0) {
    return null
  }

  const handleClick = (id: number) => {
    onNavigate(id)
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Путь к текущей папке">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        if (isLast) {
          return (
            <span key={item.id} className={styles.current}>
              {item.name}
            </span>
          )
        }

        return (
          <button
            key={item.id}
            type="button"
            className={styles.link}
            onClick={() => handleClick(item.id)}
          >
            {item.name}
            <span className={styles.separator}>/</span>
          </button>
        )
      })}
    </nav>
  )
}
