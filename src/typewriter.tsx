import { useCallback, useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

const COLS = 30

type LineData = [string, string[][]]

const getNewBlankRow = () => {
  let newRow = ''
  for (let i = 0; i < COLS; i++) newRow += ' '
  return newRow
}

export const Typewriter = () => {
  const [content, setContent] = useLocalStorage<LineData[]>('content', [])
  const [cursor, setCursor] = useLocalStorage<[number, number]>(
    'cursor',
    [0, 0]
  )
  const [col, row] = cursor

  if (col >= COLS) setCursor([0, row + 1])
  if (row >= content.length) setContent([...content, [getNewBlankRow(), []]])

  console.log('content', content)

  const typeLetter = (letter: string) => {
    const newContent = [...content]
    const [currentCol, currentRow] = cursor // Use the latest cursor state
    const characterAtCursor = newContent[currentRow][0].charAt(currentCol)

    if (characterAtCursor !== ' ') {
      if (!newContent[currentRow][1][currentCol])
        newContent[currentRow][1][currentCol] = []
      newContent[currentRow][1][currentCol].push(characterAtCursor)
    }

    newContent[currentRow][0] =
      newContent[currentRow][0].substring(0, currentCol) +
      letter +
      newContent[currentRow][0].substring(currentCol + 1)
    setContent(newContent)

    setCursor([col + 1, row])
  }

  console.log(typeLetter)

  const callback = useCallback(
    (e: KeyboardEvent) => {
      console.log(e.key)
      if (e.ctrlKey || e.metaKey) return
      if (e.key.length === 1) return typeLetter(e.key)
      if (e.key === 'Enter') setCursor([0, row + 1])
      if (e.key === 'Backspace') setCursor([Math.max(0, col - 1), row])
    },
    [typeLetter]
  )
  useEffect(() => {
    document.addEventListener('keydown', callback)
    return () => {
      document.removeEventListener('keydown', callback)
    }
  }, [callback])

  return (
    <div className="relative h-screen">
      <div className="rounded-md absolute top-1/2 left-1/2 h-6 w-3 -translate-x-1/2 -translate-y-1/2 border border-amber-600"></div>
      <div
        className="absolute top-1/2 left-1/2 text-white transition-all"
        style={{
          fontFamily: 'Courier New',
          transform: `translate(${-4.8 - 9.6 * col}px, ${-12 - 24 * row}px)`,
        }}
      >
        {content.map(([s], i) => (
          <div key={i + s} className="h-6">
            {s === '' ? ' ' : s}
          </div>
        ))}
      </div>
    </div>
  )
}
