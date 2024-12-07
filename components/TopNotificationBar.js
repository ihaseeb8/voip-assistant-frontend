
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const TopNotificationBar = ({
  userIcon,
  incomingCall,
  callState,
  callDuration,
  acceptIncomingCall,
  rejectOutgoingCall,
  rejectIncomingCall,
}) => {
    const formatCallDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      };
  return (
      <div className="w-full bg-green-600 border-b border-gray-200 p-4 py-1 shadow-sm h-14 flex items-center justify-center space-x-2">
        {/* Here comes the number of the person whom we are ringing or active call is goin with */}
     
        <Avatar className="h-8 w-8">
          <AvatarImage src={userIcon.src} />
        </Avatar>
        <span className="text-sm font-semibold text-white">
          {incomingCall?.parameters.From}

        </span>

        {/* Display Call Duration during active call */}
        {callState === "active" && (
          <span className="text-sm font-semibold text-gray-700">
            {formatCallDuration(callDuration)}
          </span>
        )}

        {/* Accept Button */}
        {callState === "ringing" && incomingCall && (
          <Button
            onClick={acceptIncomingCall}
            className={`rounded
            bg-green-800 hover:bg-green-900
           transition-all duration-300`}
          >
            {/* <PhoneIncoming className="h-5 w-5 text-white" /> */}
            <span className="">Accept</span>
          </Button>
        )}

        {/* Call Button */}
        <Button
          onClick={
            callState === "active" || incomingCall === null
              ? rejectOutgoingCall
              : rejectIncomingCall
          }
          className={`rounded
            bg-red-600 hover:bg-red-800
           transition-all duration-300`}
        >
          {/* <PhoneOutgoing className="h-5 w-5 text-white" /> */}

          <span className="">
            {callState === "active"
              ? "End call"
              : incomingCall
              ? "Decline"
              : "Hang up"}
          </span>
        </Button>
      </div>
  );
};

export default TopNotificationBar;
