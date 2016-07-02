import Inferno from 'inferno'
import { Link } from 'inferno-router'

export let Header = () =>
  <div className="pure-g header">
      <div className="pure-u-1-2"><div>InfernoMobxStarter</div></div>
      <div className="pure-u-1-2" >
        <Link className='mlink' to='/todos' >Todos</Link>
        <Link className='mlink' to='/welcome' >Welcome</Link>
        <div
            onClick= { () => alert('Mobx example') } 
            style={{float: 'right'}}>?</div></div>
  </div>
