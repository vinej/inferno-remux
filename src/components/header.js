import Inferno from 'inferno'
import { Link } from 'inferno-router'

export let Header = () =>
  <div className="pure-g header">
      <div className="pure-u-1-2"><div>Inferno Mobx ReMux Starter</div></div>
      <div className="pure-u-1-2" >
        <Link to='/welcome' >Welcome</Link>
        <Link to='/todos' >Todos</Link>
        <div
            onClick= { () => alert('Mobx example') } 
            style={{float: 'right'}}>?</div></div>
  </div>
