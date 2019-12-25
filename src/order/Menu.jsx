import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './Menu.css'

const MenuItem = memo(function MenuItem(props) {
  const { value, title, active, onPress } = props

  return (
    <li className={classnames({ active })} onClick={() => onPress(value)}>
      {title}
    </li>
  )
})

MenuItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
}

const Menu = memo(function Menu(props) {
  const { show, options, onPress, hideMenu } = props

  return (
    <div>
      {show && <div className="mask" onClick={() => hideMenu()}></div>}
      <div className={classnames('menu', { show })}>
        <div className="menu-title"></div>
        <ul>{options && options.map((option) => <MenuItem key={option.value} {...option} onPress={onPress} />)}</ul>
      </div>
    </div>
  )
})

Menu.propTypes = {
  show: PropTypes.bool.isRequired,
  options: PropTypes.array,
  onPress: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
}

export default Menu
