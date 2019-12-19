import React from 'react'
import { connect } from 'react-redux'

import './App.css'
import Header from '../common/Header'
import DepartData from './DepartDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'

function App(props) {
  return (
    <div>
      <Header />
      <Journey />
      <HighSpeed />
      <DepartData />
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return {}
  },
  function mapDispatchToProps(dispatch) {
    return {}
  },
)(App)
