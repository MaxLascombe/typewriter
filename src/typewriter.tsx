import { useCallback, useEffect, useState } from 'react'

const COLS = 30

type LineData = [string, string[][]]

const getNewBlankRow = () => {
  let newRow = ''
  for (let i = 0; i < COLS; i++) newRow += ' '
  return newRow
}

export const Typewriter = () => {
  const [content, setContent] = useState<LineData[]>([])
  const [cursor, setCursor] = useState<[number, number]>([0, 0])
  const [col, row] = cursor

  if (col >= COLS) setCursor(([, row]) => [0, row + 1])
  if (row >= content.length) setContent(c => [...c, [getNewBlankRow(), []]])

  console.log('content', content)

  const typeLetter = (letter: string) => {
    setContent(prevContent => {
      const newContent = [...prevContent]
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

      return newContent
    })

    setCursor(([currentCol, currentRow]) => [currentCol + 1, currentRow])
  }

  console.log(typeLetter)

  const callback = useCallback(
    (e: KeyboardEvent) => {
      console.log(e.key)
      if (e.ctrlKey || e.metaKey) return
      if (e.key.length === 1) return typeLetter(e.key)
      if (e.key === 'Enter') setCursor(([, row]) => [0, row + 1])
      if (e.key === 'Backspace')
        setCursor(([col, row]) => [Math.max(0, col - 1), row])
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
      <div className="absolute top-1/2 left-1/2 h-6 w-3 -translate-x-1/2 -translate-y-1/2 border border-red-500"></div>
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
