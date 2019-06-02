import './demo.scss'
import png from './1.png'
// import './2.jpg'
import React from 'react'
import ReactDOM from 'react-dom'
import 'lib-flexible'

ReactDOM.render(
  <p className="demo">
    <img src={png} alt=""/>
    <img src="2.jpg" alt=""/>
    12345
  </p>,
  document.getElementById('app')
)