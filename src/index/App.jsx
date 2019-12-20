import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './App.css'
import Header from '../common/Header'
import CitySelector from '../common/CitySelector'
import DateSelector from '../common/DateSelector'
import DepartData from './DepartDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'
import Submit from './Submit'
import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed,
} from './actions'
import { h0 } from '../common/utils'

function App(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    departDate,
    isDateSelectorVisible,
    highSpeed,
    dispatch,
  } = props

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

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideCitySelector,
        fetchCityData,
        onSelect: setSelectedCity,
      },
      dispatch,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const departDateCbs = useMemo(() => {
    return bindActionCreators(
      {
        onClick: showDateSelector,
      },
      dispatch,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideDateSelector,
      },
      dispatch,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelectDate = useCallback(
    (day) => {
      if (!day) return

      if (day < h0()) return

      dispatch(setDepartDate(day))
      dispatch(hideDateSelector())
    },
    [dispatch],
  )

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({ toggle: toggleHighSpeed }, dispatch)
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
        <DepartData time={departDate} {...departDateCbs} />
        <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
        <Submit />
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector show={isDateSelectorVisible} {...dateSelectorCbs} onSelect={onSelectDate} />
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
