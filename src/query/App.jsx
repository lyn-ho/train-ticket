import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'

import './App.css'
import Header from '../common/Header'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'

import useNav from '../common/useNav'
import { h0 } from '../common/utils'
import {
  setFrom,
  setTo,
  setDepartDate,
  setHighSpeed,
  setSearchParsed,
  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,
  prevDate,
  nextDate,
} from './actions'

function App(props) {
  const {
    trainList,
    from,
    to,
    departDate,
    hightSpeed,
    searchParsed,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    dispatch,
  } = props

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const { from, to, hightSpeed, date } = queries

    dispatch(setFrom(from))
    dispatch(setTo(to))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))
    dispatch(setHighSpeed(hightSpeed === 'true'))

    dispatch(setSearchParsed(true))
  }, [dispatch])

  useEffect(() => {
    if (!searchParsed) {
      return
    }

    const url = new URI('/rest/query')
      .setSearch('from', from)
      .setSearch('to', to)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('hightSpeed', hightSpeed)
      .setSearch('orderType', orderType)
      .setSearch('onlyTickets', onlyTickets)
      .setSearch('checkedTicketTypes', Object.keys(checkedTicketTypes).join())
      .setSearch('checkedTrainTypes', Object.keys(checkedTrainTypes).join())
      .setSearch('checkedDepartStations', Object.keys(checkedDepartStations).join())
      .setSearch('checkedArriveStations', Object.keys(checkedArriveStations).join())
      .setSearch('departTimeStart', departTimeStart)
      .setSearch('departTimeEnd', departTimeEnd)
      .setSearch('arriveTimeStart', arriveTimeStart)
      .setSearch('arriveTimeEnd', arriveTimeEnd)
      .toString()

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: { ticketType, trainType, depStation, arrStation },
            },
          },
        } = result

        dispatch(setTrainList(trains))
        dispatch(setTicketTypes(ticketType))
        dispatch(setTrainTypes(trainType))
        dispatch(setDepartStations(depStation))
        dispatch(setArriveStations(arrStation))
      })
  }, [
    arriveTimeEnd,
    arriveTimeStart,
    checkedArriveStations,
    checkedDepartStations,
    checkedTicketTypes,
    checkedTrainTypes,
    departDate,
    departTimeEnd,
    departTimeStart,
    dispatch,
    from,
    hightSpeed,
    onlyTickets,
    orderType,
    searchParsed,
    to,
  ])

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(dispatch, departDate, prevDate, nextDate)

  if (!searchParsed) return null

  return (
    <div>
      <div className="header-wrapper">
        <Header title={`${from} ⇀ ${to}`} onBack={onBack} />
      </div>
      <Nav date={departDate} isPrevDisabled={isPrevDisabled} isNextDisabled={isNextDisabled} prev={prev} next={next} />
      <List list={trainList} />
      <Bottom />
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
