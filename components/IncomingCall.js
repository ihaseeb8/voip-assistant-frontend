import React from 'react'

const IncomingCall = (call, onAccept, onReject) => {
    console.log('received incoming call notification', call)
    return (
      <div className="bg-green-500 text-white p-4 flex justify-between items-center w-full">
        <div className="text-left">
          {`Incoming call from nothing`}
          {/* {`Incoming call from ${call.call.parameters.From || 'nothing'}`} */}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={onAccept}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Accept
          </button>
          <button 
            onClick={onReject} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    )
  }
  

export default IncomingCall