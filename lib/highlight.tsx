/**
 * lib/highlight.tsx
 * 텍스트에서 검색어를 찾아 <mark> 태그로 강조
 */

export function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text

  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary/20 px-0.5 text-primary not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}
