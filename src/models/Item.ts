export type FileType = 'dir' | 'file'

export type FileExtension =
  | 'jpg'
  | 'jpeg'
  | 'gif'
  | 'png'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'txt'

export type RawItem = {
  id: number
  type: FileType
  parentId: number | null
  name: string
  isFavorite: boolean
}

export class Item {
  id: number
  type: FileType
  parentId: number | null
  name: string
  isFavorite: boolean
  children: Item[]
  extension?: FileExtension

  constructor(row: RawItem) {
    this.id = row.id
    this.type = row.type
    this.parentId = row.parentId
    this.name = row.name
    this.isFavorite = row.isFavorite
    this.children = []

    this.extension = this.extractExtension(row.name)
  }

  private extractExtension(name: string): FileExtension | undefined {
    const lastDotIndex = name.lastIndexOf('.')
    if (lastDotIndex === -1 || lastDotIndex === name.length - 1) {
      return undefined
    }

    const ext = name.slice(lastDotIndex + 1).toLowerCase()

    const allowed: FileExtension[] = [
      'jpg',
      'jpeg',
      'gif',
      'png',
      'pdf',
      'doc',
      'docx',
      'txt',
    ]

    if (allowed.includes(ext as FileExtension)) {
      return ext as FileExtension
    }

    return undefined
  }

  isImage(): boolean {
    if (this.type !== 'file' || !this.extension) {
      return false
    }

    return this.extension === 'jpg' || this.extension === 'jpeg' || this.extension === 'gif'
  }
}

export function isItem(value: unknown): value is Item {
  return value instanceof Item
}
