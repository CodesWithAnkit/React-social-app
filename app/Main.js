import React from 'react'
import ReactDOM from 'react-dom'

const SimpleComponent = () => {
  return (
    <div>
      <h1>This is our App!!!!!!</h1>
      <p>Water is life, You can </p>
    </div>
  )
}

ReactDOM.render(<SimpleComponent />, document.getElementById('app'))

// This is for auto reload without refresing
if (module.hot) {
  module.hot.accept()
}
