import React from 'react'
import './index.scss'

/**
 * AnimatedLetters - Kinetic letter-by-letter entrance animation.
 *
 * Encapsulates words in dedicated `<span className="animated-word">` containers
 * with `white-space: nowrap` and `display: inline-block` to guarantee:
 *  1. Words never split or break mid-word across screen edges or layout reflows (e.g. "Station", "engineer").
 *  2. Browser auto-translators (e.g. Brave Translate, Chromium) never slice letters into syllable fragments.
 *  3. Full screen-reader accessibility with clean `aria-label` and `aria-hidden` per-character semantics.
 */
const AnimatedLetters = ({ letterClass, strArray, idx = 1 }) => {
  const fullText = Array.isArray(strArray) ? strArray.join('') : String(strArray || '')

  // Split into words by spaces to guarantee words never break mid-character
  const words = fullText.split(' ')
  let runningIdx = idx

  return (
    <span
      className="animated-word-wrap notranslate"
      aria-label={fullText}
      translate="no"
    >
      {words.map((word, wordIndex) => {
        const wordChars = word.split('')
        const wordElement = (
          <span
            key={`w-${wordIndex}-${word}`}
            className="animated-word"
          >
            {wordChars.map((char, charIndex) => {
              const currentIdx = runningIdx++
              return (
                <span
                  key={`c-${wordIndex}-${charIndex}-${char}`}
                  aria-hidden="true"
                  className={`${letterClass} _${currentIdx}`}
                >
                  {char}
                </span>
              )
            })}
          </span>
        )

        // Increment running index for the space character between words
        if (wordIndex < words.length - 1) {
          runningIdx++
          return (
            <React.Fragment key={`ww-${wordIndex}`}>
              {wordElement}
              <span className="animated-word-space" aria-hidden="true">
                &nbsp;
              </span>
            </React.Fragment>
          )
        }

        return wordElement
      })}
    </span>
  )
}

export default AnimatedLetters
