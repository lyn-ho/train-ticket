import React, { useState, useMemo, memo, useCallback } from 'react';



const Counter = memo(function Counter(props) {
  console.log('Counter render')

  return (
    <h1 onClick={props.onClick}>{props.count}</h1>
  )
})


function App() {
  const [count, setCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const double = useMemo(() => {
    return count * 2
  }, [count])

  const half = useMemo(() => {
    return double / 4
  }, [double])

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
  }, [])

  return (
    <>
      <button onClick={() => { setCount(count + 1) }}>Click ({count})</button>
      <p>{half}</p>
      <Counter count={double} onClick={onClick} />
    </>
  )

}

export default App;

