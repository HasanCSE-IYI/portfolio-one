import './index.scss'

const AnimatedLetters = ({ letterClass, strArray, idx = 1 }) => {
  return (
    <span className="animated-word-wrap">
      {strArray.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`${letterClass} _${i + idx} ${char === ' ' ? 'space-char' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default AnimatedLetters
