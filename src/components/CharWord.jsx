export default function CharWord({ word, isLast, initialColor = 'rgba(0,0,0,0.3)', charClassName = 'char-highlight' }) {
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {word.split('').map((char, i) => (
        <span
          key={i}
          className={charClassName}
          style={{ display: 'inline-block', color: initialColor }}
        >
          {char}
        </span>
      ))}
      {!isLast && (
        <span
          className={charClassName}
          style={{ display: 'inline-block', color: initialColor }}
        >
          {' '}
        </span>
      )}
    </span>
  )
}
