import Inferno from 'inferno'

export let Header = () => 
  <div className="pure-g header">
      <div className="pure-u-1-2"><div>Inferno-Mobx-Starter</div></div>
      <div className="pure-u-1-2">
        <div
            onClick= { () => alert('Mobx example') } 
            style={{float: 'right'}}>?</div></div>
  </div>
