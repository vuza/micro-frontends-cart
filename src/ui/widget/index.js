import React from 'react'

const App = props => {
  if (props.name) {
    return [
      <div>
        <p>Hi <a href="/user">{props.name}</a> (^_^)</p>
        <p>Du hast {props.products ? props.products.length : 0} Artikel im <a href="/cart">Warenkorb</a></p>
        <style jsx>{`
              p {
                  text-align: right;
              }
          `}</style>
      </div>
    ]
  }

  return [
    <div>
      <p><a href="/user">Anmelden</a> ¯\_(ツ)_/¯</p>
      <style jsx>{`
            p a {
              text-transform: uppercase;
            }
        `}</style>
    </div>
  ]
}

export default App
