import React, { useState } from 'react';

// class App2 extends Component {
//   state = {
//     count: 0
//   }

//   render() {
//     const { count } = this.state
//     return (
//       <button onClick={() => { this.setState({ count: count + 1 }) }}>Click ({count})</button>

//     )
//   }
// }


function App(props) {
  // const [count, setCount] = useState(0)
  const [count, setCount] = useState(() => (props.defaultCount || 0))
  const [name, setName] = useState('Lyn')


  return (
    <button onClick={() => { setCount(count + 1) }}>Click ({count}), ({name})</button>
  )

}


export default App;
