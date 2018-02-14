import React from 'react'

const App = props => {
  if (props.name) {
    return [
      <div>
        <p>Hi <a href="/user">{props.name}</a> (^_^)</p>
        <p>Du hast {props.articleCount || 0} Artikel im <a href="/cart">Warenkorb</a></p>
        <style jsx>{`
              p {
                  color: green;
              }
          `}</style>
      </div>
    ]
  }

  return [
    <div>
      <p>Hi, magst du dich nicht <a href="/user">anmelden</a>? ¯\_(ツ)_/¯</p>
      <style jsx>{`
            p {
                color: green;
            }
        `}</style>
    </div>
  ]
}

export default App
