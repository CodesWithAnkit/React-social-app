import React from 'react'

const FlashMessages = ({ messages }) => {
  return (
    <div className="floating-alerts">
      {messages == null ? (
        <h1>Loading...</h1>
      ) : (
        messages.map((msg, index) => {
          return (
            <div
              key={index}
              className="alert alert-success text-center floating-alert shadow-sm"
            >
              {msg}
            </div>
          )
        })
      )}
    </div>
  )
}

export default FlashMessages
