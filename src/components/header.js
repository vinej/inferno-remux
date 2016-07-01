import Inferno from 'inferno'

export let Header = () => 
  <div className="pure-g header">
      <div className="pure-u-1-4"><div>InfernoMobxStarter</div></div>
      <div className="pure-u-3-4">
        <div
            onClick= { () => alert('Mobx example') } 
            style={{float: 'right'}}>?</div></div>
  </div>
