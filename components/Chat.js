// import { Device } from "@twilio/voice-sdk";

import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Search, Send, Archive, ImageIcon, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import userIcon from '../app/icons/user-round.svg'
import AuthContext from '@/components/AuthContext'
import { jwtDecode } from "jwt-decode";

import { PhoneOutgoing } from "lucide-react";

const Chat = ({ contact, toggleSidebar, fetchContacts, makeOutgoingCall }) => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state to hold the search query
  const [message, setMessage] = useState('');
  const [isLoading, setisLoading] = useState(true)
  const {user, login, logout} = useContext(AuthContext);

  // const deviceRef = useRef(null); // Persistent Device instance
  const chatContainerRef = useRef(null); // Scroll container ref
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const [callState, setCallState] = useState("idle"); // idle, ringing, active
  // const [callDuration, setCallDuration] = useState(0); // Call duration in seconds
  // const callTimerRef = useRef(null); // Ref to manage call timer
  // let incomingCall = null;
  // const [incomingCall, setIncomingCall] = useState(null);
  // const setIncomingCall = (call)=>{
  //   incomingCall = call
  // }
  // const [micVolume, setMicVolume] = useState(0);
  // const [speakerVolume, setSpeakerVolume] = useState(0);



  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // const [availableDevices, setAvailableDevices] = useState({
  //   speakers: [],
  //   ringers: [],
  // });
  // const [selectedDevices, setSelectedDevices] = useState({
  //   speakers: [],
  //   ringers: [],
  // });
  
  // const updateAudioDevices = () => {
  //   deviceRef.current.audio.speakerDevices.set(selectedDevices.speakers);
  //   deviceRef.current.audio.ringtoneDevices.set(selectedDevices.ringers);
  // };

  // const bindVolumeIndicators = (call) => {
  //   call.on("volume", (inputVolume, outputVolume) => {
  //     setMicVolume(Math.floor(inputVolume * 100)); // Convert to percentage
  //     setSpeakerVolume(Math.floor(outputVolume * 100));
  //   });
  // };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // initializeTwilioDevice();
    if (contact && contact.phone_number) {
      fetchMessages(contact.phone_number);
    }

    const socket = new WebSocket(`${backendURL.replace('http://', 'ws://').replace('https://', 'ws://')}/ws`);

    socket.onopen = function () {
      console.log("Chat: WebSocket connection established");
    };

    socket.onerror = function (error) {
      console.error("Chat: WebSocket error observed:", error);
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const phoneNumber = data.phone_number;
      const newMessage = data.response_dict;

      // console.log('newwww msggg', newMessage)
      if (phoneNumber === contact.phone_number) {
        fetchMessages(contact.phone_number);
        fetchContacts();
      }
      // scrollToBottom();
    };

    socket.onclose = function () {
      console.log("Chat: WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [contact]);

  // const initializeTwilioDevice = async () => {
  //   try {
  //     const username = user.username || "defaultUser";
  //     const response = await fetch(`${backendURL}/token?identity=${username}`);
  //     const data = await response.json();

  //     if (!data.token) {
  //       throw new Error("Failed to retrieve Twilio token");
  //     }
  //     const token = data.token;
  //     const decodedToken = jwtDecode(token);
  //     const identity = decodedToken.sub || decodedToken.identity;
  //     console.log('decodedToken: ', decodedToken);
  //     console.log('Device Identity:', identity);

  //     deviceRef.current = new Device(data.token, { allowIncomingWhileBusy: true, closeProtection: true, logLevel: 1, codecPreferences: ["opus", "pcmu"],});
  //     deviceRef.current.on("registered", () => console.log("Twilio Device registered successfully"));
  //     deviceRef.current.on("incoming", handleIncomingCall);
  //     deviceRef.current.on("deviceChange", () => {
  //       console.log("Device change detected");
  //       updateAudioDevices();
  //     });
  //     deviceRef.current.on("error", (error) => console.error("Device error:", error.message));
  //     deviceRef.current.on("disconnect", () => console.log("Device disconnected"));
  //     deviceRef.current.register();
  //   } catch (error) {
  //     console.error("Error initializing Twilio Device:", error);
  //   }
  // };


  // const startCallTimer = () => {
  //   setCallDuration(0); // Reset duration
  //   callTimerRef.current = setInterval(() => {
  //     setCallDuration((prev) => prev + 1);
  //   }, 1000);
  // };

  // const stopCallTimer = () => {
  //   clearInterval(callTimerRef.current);
  //   callTimerRef.current = null;
  // };

  // const formatCallDuration = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  // };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    // Helper function to get the start of the week (assuming the week starts on Sunday)
    const getStartOfWeek = (date) => {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0); // Reset to start of day
      return startOfWeek;
    };
  
    // Check if date is today
    const isToday = date.toDateString() === now.toDateString();
  
    // Check if date is within the same week as today
    const isSameWeek = getStartOfWeek(now).getTime() === getStartOfWeek(date).getTime();
  
    // Format time as hh:mm AM/PM
    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Enable AM/PM format
    };
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
  
    if (isToday) {
      // If date is today, show only the time
      return formattedTime;
    } else if (isSameWeek) {
      // If within the same week, show day of the week and time
      const optionsDay = { weekday: 'short' }; // Short day name
      const formattedDay = date.toLocaleDateString('en-US', optionsDay);
      return `${formattedDay} ${formattedTime}`;
    } else {
      // If not today and not within the same week, show dd/mm/yy and time
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
      return `${day}/${month}/${year} ${formattedTime}`;
    }
  };

  // const handleIncomingCall = (call) => {
  //   bindVolumeIndicators(call);
  //   setIncomingCall(call);
  //   setCallState("ringing");

  //   // Attach Call events
  //   call.on("accept", () => {
  //     console.log("Incoming call accepted.");
  //     setCallState("active");
  //   });

  //   call.on("disconnect", () => {
  //     console.log("Incoming call disconnected.");
  //     setIncomingCall(null);
  //     setCallState("idle");
  //   });

  //   call.on("error", (error) => {
  //     console.error("Incoming call error:", error.message);
  //     setIncomingCall(null);
  //     setCallState("idle");
  //   });
  //   // acceptIncomingCall();
  // };

  // const acceptIncomingCall = () => {
  //   console.log("incoming call null or not", incomingCall)
  //   if (incomingCall) {
  //     incomingCall.accept();
  //     setCallState("active");
  //   }else{
  //     console.log('incoming call is not true')
  //   }
  // };

  // const rejectIncomingCall = () => {
  //   if (incomingCall) {
  //     incomingCall.reject();
  //     setCallState("idle");
  //   }
  // };

  // const makeOutgoingCall = () => {
  //   const device = deviceRef.current;
  //   if (!device || !contact?.phone_number) {
  //     console.error("Twilio Device is not initialized or contact number is missing.");
  //     return;
  //   }

  //   if (callState !== "idle") {
  //     console.error("A call is already active.");
  //     return; // Prevent initiating a new call
  //   }
    
  //   const params = { To: contact.phone_number };
  //   const call = deviceRef.current.connect({params}); // Initiate outgoing call

  //   if (!call) {
  //     console.error("Failed to initiate call.");
  //     return;
  //   }


  //   setCallState("ringing");

  //   bindVolumeIndicators(deviceRef.current);
  //   console.log("Outgoing call initiated.");

  //   console.log(device)
  //   // Attach call lifecycle events via the Device instance
  //   device.on("ringing", () => {
  //     console.log("The call is ringing.");
  //     setCallState("ringing");
  //   });

  //   device.on("connect", () => {
  //     console.log("The call has been accepted.");
  //     setCallState("active");
  //     startCallTimer();
  //   });

  //   device.on("disconnect", () => {
  //     console.log("The call has been disconnected.");
  //     setCallState("idle");
  //     stopCallTimer();
  //   });

  //   device.on("error", (error) => {
  //     console.error("Call error:", error.message);
  //     setCallState("idle");
  //     stopCallTimer();
  //   });
  // };


  // const rejectOutgoingCall = () => {
  //   if (callState === "active" || callState === "ringing") {
  //     deviceRef.current.disconnectAll();
  //     setCallState("idle");
  //     stopCallTimer();
  //   }
  // };

  // useEffect(() => {
  //   return () => stopCallTimer(); // Cleanup timer on component unmount
  // }, []);


  const fetchMessages = async (contactNumber) => {
    try {
      const response = await fetch(`${backendURL}/messages-by-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ contact_number: contactNumber }),
      });

      if (response.status === 401) {
        logout();
      }

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    setisLoading(false)
  };

  const handleSendMessage = async () => {
    // Prevent sending if no message and no image
    if (!message.trim() && !selectedImage) return;

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('contact_number', contact.phone_number);
      
      // Add message if exists
      if (message.trim()) {
        formData.append('message', message);
      }
      
      // Add image if selected
      if (selectedImage) {
        formData.append('media', selectedImage);
      }

      const response = await fetch(`http://${backendURL}/send-assistant-message`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: formData, // Use FormData instead of JSON
      });

      if (response.status === 401) {
        logout();
      }

      if (response.ok) {
        // Reset message and image states
        setMessage("");
        removeSelectedImage();
        console.log("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-200"
    style={{ height: 'calc(100vh - 56px)' }}
    >
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-gray-100" onClick={toggleSidebar}>
            <Menu className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={userIcon.src} alt="Contact" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{contact.phone_number}</h2>
          </div>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button
            onClick={callState === "active" || callState === "ringing" ? rejectOutgoingCall : makeOutgoingCall}
            className={`rounded-full mx-2 ${
              callState === "active" || callState === "ringing"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } transition-all duration-300`}
          >
            <PhoneOutgoing className="h-5 w-5 text-white" />
            <span className="sr-only">
              {callState === "active" || callState === "ringing" ? "End call" : "Make call"}
            </span>
          </Button>

          {callState === "active" && (
            <div className="text-sm font-semibold text-gray-700 px-2">{formatCallDuration(callDuration)}</div>
          )}
        </div> */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={makeOutgoingCall}
            className={`rounded-full bg-green-600 hover:bg-green-400
            transition-all duration-300`}
          >
            <PhoneOutgoing className="h-5 w-5 text-white" />
            <span className="sr-only">
              Make call
            </span>
          </Button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search in conversation"
            className="pl-10 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>
      </header>

      {imagePreview && (
        <div className="absolute bottom-20 right-4 z-10 w-64 h-64 bg-white shadow-lg rounded-lg p-2">
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="w-full h-full object-cover rounded-md"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
              onClick={removeSelectedImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4">
      <div ref={chatContainerRef} className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'assistant' ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`inline-block sm:max-w-[60%] max-w-[90%] rounded-lg p-3 shadow-md ${
                  message.role === 'assistant'
                    ? "bg-green-600 text-white rounded-br-none"
                    : message.role === 'user'
                    ? "bg-white rounded-bl-none"
                    : 'hidden'
                }`}
              >
                {message.media_path ? (
                  <img
                    src={`${backendURL}${message.media_path.substring(message.media_path.indexOf("/media"))}`}
                    alt="Message Media"
                    className="rounded-md max-w-full"
                    style={{ width: '600px', height: 'auto' }} // Temporary debug styles
                    onError={(e) => {
                      console.error(`Image failed to load: ${backendURL}${message.media_path}`);
                      e.target.style.display = 'none'; // Fallback to hide image
                    }}
                    onLoad={() => {}}
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}

                {message.media_path && message.content && 
                  <p className="text-sm py-2">{message.content}</p>
                }
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {message.timestamp ? <>{formatTimestamp(message.timestamp)}</> : <></>}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center h-screen">{`${isLoading ? 'Loading Messages...' : ''}`}</p>
        )}
      </div>
    </ScrollArea>

    <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          {/* Image Upload Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Upload Image</span>
          </Button>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <Input 
            placeholder="Type a message" 
            className="flex-1 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-green-500 focus:ring-offset-2" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button 
            size="icon" 
            className="rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200"
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedImage}
          >
            <Send className="h-5 w-5 text-white" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
        