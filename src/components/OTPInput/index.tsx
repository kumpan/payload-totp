'use client'

import { FormEvent, useCallback, useRef } from 'react'

import styles from './index.module.scss'

type Args = {
  length?: number
  disabled?: boolean
  name?: string
  onFilled?: (value: string) => void
}

export default function OTPInput({ disabled, onFilled, name, length = 6 }: Args) {
  const inputs = useRef<HTMLInputElement[]>(Array(length).fill(null))
  const hiddenInput = useRef<HTMLInputElement>(null)
  const isFilled = hiddenInput.current?.value.length === length

  const moveToPrev = (currentIndex: number) => {
    if (currentIndex > 0) {
      const prevInput = inputs.current[currentIndex - 1]
      prevInput && focusAndSelectInput(prevInput)
    }
  }

  const moveToNext = useCallback(
    (currentIndex: number) => {
      if (currentIndex < length - 1) {
        const nextInput = inputs.current[currentIndex + 1]
        nextInput && focusAndSelectInput(nextInput)
      }
    },
    [length],
  )

  const onInput = (event: FormEvent<HTMLInputElement>, index: number) => {
    const nativeEvent = event.nativeEvent as InputEvent

    if (nativeEvent.inputType === 'deleteContentBackward') {
      moveToPrev(index)
    } else if (
      nativeEvent.inputType === 'insertText' ||
      nativeEvent.inputType === 'deleteContentForward'
    ) {
      moveToNext(index)
    }

    updateInputValue()
  }

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (event.nativeEvent.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      const target = event.target as HTMLInputElement

      switch (event.key) {
        case 'ArrowLeft':
          moveToPrev(index)
          event.preventDefault()
          break

        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault()
          break

        case 'Backspace':
          if (target.value.length === 0) {
            moveToPrev(index)
            updateInputValue()
            event.preventDefault()
          } else if (target.selectionStart === 0) {
            target.value = ''
            moveToPrev(index)
            updateInputValue()
            event.preventDefault()
          }

          break

        case 'ArrowRight':
          moveToNext(index)
          event.preventDefault()
          break

        default:
          if (
            !(
              (event.code.startsWith('Digit') || event.code.startsWith('Numpad')) &&
              Number(event.key) >= 0 &&
              Number(event.key) <= 9
            )
          ) {
            event.preventDefault()
          }

          if (target.value.length >= 1) {
            event.preventDefault()
            target.value = event.key
            moveToNext(index)
          }

          break
      }
    },
    [length],
  )

  const onPaste = useCallback(
    (event: React.ClipboardEvent) => {
      event.preventDefault()

      if (!disabled) {
        let paste = event.clipboardData
          .getData('text')
          .trim()
          .split('')
          .filter((ch) => !isNaN(parseInt(ch)))

        paste.length > length && (paste = paste.slice(0, length))

        paste.forEach((char, index) => {
          const el = inputs.current[index]
          el && (el.value = char)
        })

        focusAndSelectInput(inputs.current[paste.length - 1])
        updateInputValue()
      }
    },
    [length],
  )

  const updateInputValue = useCallback(() => {
    if (hiddenInput.current) {
      const value = inputs.current
        .filter(Boolean)
        .map((e) => e!.value)
        .join('')

      hiddenInput.current.value = value

      onFilled && value.length === length && onFilled(value)
    }
  }, [onFilled, length])

  return (
    <>
      <input type="hidden" name={name} ref={hiddenInput} />
      <div className={cn(styles.root, disabled && styles.disabled)}>
        {Array.from({ length: length }, (_, index) => index).map((i) => (
          <input
            ref={(el) => {
              if (el) {
                inputs.current[i] = el
              }
            }}
            key={i}
            autoFocus={i === 0}
            disabled={disabled}
            type="text"
            maxLength={1}
            onInput={(e) => onInput(e, i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onPaste={(e) => onPaste(e)}
          />
        ))}
        <div className={styles.focus}></div>
        <div className={cn(styles.glow, isFilled && styles.expandGlow)}>
          {Array.from({ length: length }, (_, index) => index).map((i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>
    </>
  )
}

function focusAndSelectInput(element: HTMLInputElement): void {
  element.focus()
  element.select()
}

function cn(...classNames: (string | boolean | undefined | null)[]) {
  return classNames.filter(Boolean).join(' ')
}
