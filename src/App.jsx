import React, { Component, memo } from 'react';
import './App.css';

// class Foo extends Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     if (nextProps.name === this.props.name) {
//       return false
//     }

//     return true
//   }

//   render() {
//     console.log('Foo render')

//     return null
//   }
// }

// class Foo extends PureComponent {
//   render() {
//     console.log('Foo render')

//     return <div>{this.props.person.age}</div>
//   }
// }

const Foo = memo(function Foo(props) {
  return <div>{props.person.age}</div>
})

class App extends Component {
  state = {
    count: 0,
    person: {
      age: 18
    }
  }

  callback = () => { }

  render() {
    const { person } = this.state
    return (
      // <div>
      //   <button onClick={() => {
      //     person.age++
      //     this.setState({ person })
      //   }}>Add</button>
      //   <Foo person={person} />
      // </div>
      <div>
        <button onClick={() => {
          person.age++
          this.setState({ count: this.count + 1 })
        }}>Add</button>
        {/* <Foo person={person} cb={() => { }} /> */}
        <Foo person={person} cb={this.callback} />
      </div>
    )

  };
}

export default App;
