import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './App.css'
import Header from '../common/Header'
import CitySelector from '../common/CitySelector'
import DepartData from './DepartDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'
import { exchangeFromTo, showCitySelector, hideCitySelector } from './actions'

function App(props) {
  const { from, to, isCitySelectorVisible, cityData, isLoadingCityData, dispatch } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  // const doExchangeFromTo = useCallback(() => {
  //   dispatch(exchangeFromTo())
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const doShowCitySelector = useCallback((bool) => dispatch(showCitySelector(bool)), [])

  const cbs = useMemo(() => {
    return bindActionCreators(
      {
        exchangeFromTo,
        showCitySelector,
      },
      dispatch,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CitySelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideCitySelector,
      },
      dispatch,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack} />
      </div>
      <form className="form">
        {/* <Journey from={from} to={to} exchangeFromTo={doExchangeFromTo} showCitySelector={doShowCitySelector} /> */}
        <Journey from={from} to={to} {...cbs} />
        <HighSpeed />
        <DepartData />
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...CitySelectorCbs}
      />
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  },
)(App)
