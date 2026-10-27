import './index.scss'

const AnimatedLetters = ({ letterClass, strArray, idx = 1 }) => {
  const fullText = strArray.join('')

  return (
    <span className="animated-word-wrap" aria-label={fullText}>
      {strArray.map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className={`${letterClass} _${i + idx} ${char === ' ' ? 'space-char' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default AnimatedLetters
