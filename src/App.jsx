import React, { useState, useMemo, PureComponent, memo, useCallback, useRef, useEffect } from 'react';



// const Counter = memo(function Counter(props) {
//   console.log('Counter render')

//   return (
//     <h1 onClick={props.onClick}>{props.count}</h1>
//   )
// })

class Counter extends PureComponent {
  speak() {
    console.log(`now counter is: ${this.props.count}`)
  }

  render() {
    const { onClick, count } = this.props

    return (<h1 onClick={onClick}>{count}</h1>)
  }
}


function App() {
  const [count, setCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const counterRef = useRef()

  const double = useMemo(() => {
    return count * 2
  }, [count])

  const half = useMemo(() => {
    return double / 4
  }, [double])

  const it = useRef()

  // const onClick = useMemo(() => {
  //   return () => {
  //     console.log('Click')
  //   }
  // }, [])

  // const onClick = useCallback(() => {
  //   console.log('Click')
  //   setClickCount(clickCount + 1)
  // }, [clickCount])


  const onClick = useCallback(() => {
    console.log('Click')
    setClickCount(clickCount => clickCount + 1)

    // console.log(counterRef.current)
    counterRef.current.speak()
  }, [counterRef])

  useEffect(() => {
    it.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000);
  }, [])

  useEffect(() => {
    if (count >= 10) {
      clearInterval(it.current)
    }
  })

  return (
    <>
      <button onClick={() => { setCount(count + 1) }}>Click ({count})</button>
      <p>{half}</p>
      <Counter ref={counterRef} count={double} onClick={onClick} />
    </>
  )

}

export default App;

