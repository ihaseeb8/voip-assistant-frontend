'use client'

import { useState, useEffect, useContext } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {Switch} from '@/components/ui/switch'
import { Menu, D, MoreVertical, Phone, Search, Send, Video, User, Archive, ArchiveRestore, MessageCircle } from 'lucide-react'
import Chat from "@/components/Chat"
import userIcon from '../app/icons/user-round.svg'
import { cn } from "@/lib/utils"
import AuthContext from "@/app/context/AuthContext"

export default function ChatInterface() {

  const {user, login, logout} = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const [isGPTEnabled, setIsGPTEnabled] = useState(false)
  const [contacts, setContacts] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loadFailed, setloadFailed] = useState(false)
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // const token = localStorage.getItem('token')
  // const filteredContacts = (contacts || []).filter(contact =>
  //   contact.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Filtered contacts based on search and archive status
  const filteredContacts = contacts.filter(contact => {
    // If searchTerm is active, ignore the archive status
    if (searchQuery) {
        return contact.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
        return showArchived ? contact.is_archived : !contact.is_archived;
    }
  });

  
  // Inside the Home component
  const handleChatSelect = (contact) => {

    // console.log(contact)
    toggleSidebar();
    setSelectedChat(contact); // Set the selected chat to the clicked contact
    
    // setSelectedChat({phone_number: '0123456', is_archived: false, message: "", unread_count: 0, timestamp: '2024-11-06T20:49:55.694712+00:00'})

    setTimeout(()=>{
      fetchContacts();
    }, 1000)
    
  }



  // useEffect(()=>{
  //   fetchContacts();
  // }, [selectedChat])
  

  useEffect(() => {
    fetchContacts();
    fetchGPTStatus();
    // console.log(backendURL)

    // Websocket logic.
    // WebSocket setup
    const socket = new WebSocket(`ws://${backendURL}/ws`);
    
    socket.onopen = function () {
        console.log("WebSocket connection established");
    };

    socket.onerror = function (error) {
        console.error("WebSocket error observed:", error);
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        // console.log(data)
        const phoneNumber = data.phone_number;
        const newMessage = data.messages;

        fetchContacts();
        fetchGPTStatus();

        // if (phoneNumber === contact.phone_number) {
        //     // setMessages((prevMessages) => [...prevMessages, newMessage]);
        // }
        // scrollToBottom();
    };

    socket.onclose = function () {
        // console.log("WebSocket connection closed");
    };

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
        socket.close();
    };
    
  }, [])

  function fetchGPTStatus() {
    fetch(`http://${backendURL}/is-allowed`, {method: "GET", headers: {'Authorization': `Bearer ${user.access_token}`}})
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        if(res.status == 401){
            logout();
        }
        return res.json();
      })
      .then((data) => {
        setIsGPTEnabled(data.allow_gpt)
      })
      .catch((error) => {
        console.error('Error fetching GPT status:', error);
      });
  }
  

  function fetchContacts(){
    fetch(`http://${backendURL}/contacts-list`, {method: "GET", headers: {'Authorization': `Bearer ${user.access_token}`}})
        .then((res) => {
            if(res.status == 401){
                logout();
            }
            return res.json();
        })
        .then((data) => {
            if(data.error){
            setContacts([])
            setloadFailed(true)
            } else {
            setContacts(data.contacts_list)
            // console.log(data.contacts_list)
            }        
        })
  }


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  
  const toggleGPT = (event) => {
    // event is either true or false
    // console.log(event)
    // setIsGPTEnabled(!isGPTEnabled)
    updateGPTStatus(event)

    setTimeout(()=>{
      fetchGPTStatus();
    }, 100)
  }

  function updateGPTStatus(allowGPT) {
    fetch(`http://${backendURL}/let-gpt-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({ allow_gpt: allowGPT }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        if(res.status == 401){
            logout();
        }
        return res.json();
      })
      .then((data) => {
        console.log('GPT Update Response:', data);
      })
      .catch((error) => {
        console.error('Error updating GPT status:', error);
      });
  }

  function toggleArchiveChat(contact) {
    fetch(`http://${backendURL}/archive-chat`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone_number: contact.phone_number,
            archive: !contact.is_archived
        })
    })
    .then((res) => {
        if (res.status === 401) {
            logout();
            return null;
        }
        return res.json();
    })
    .then((data) => {
        if (data && data.message) {
            console.log(data.message);
        } else if (data && data.error) {
            alert("Failed to archive/unarchive chat.");
        }
    })
    .catch((error) => {
        console.error("Error archiving/unarchiving chat:", error);
        alert("Failed to update archive status. Please try again.");
    });
  }


  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
  
    // Helper function to check if the date is today
    const isToday = (date, today) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  
    // Helper function to get the start of the week (assuming the week starts on Sunday)
    const getStartOfWeek = (date) => {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight
      return startOfWeek;
    };
    
    // Helper function to check if the date is within the same week as today
    const isSameWeek = (date, today) => {
      const startOfCurrentWeek = getStartOfWeek(today);
      const startOfGivenWeek = getStartOfWeek(date);
      return startOfCurrentWeek.getTime() === startOfGivenWeek.getTime();
    };
  
    // Format time as hh:mm AM/PM
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
  
    // Format date as dd/mm/yy
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
      return `${day}/${month}/${year}`;
    };
  
    // Get the weekday name (Mon, Tue, etc.)
    const formatWeekday = (date) => {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };
  
    // Logic to determine which format to use
    if (isToday(date, today)) {
      return formatTime(date);
    } else if (isSameWeek(date, today)) {
      return formatWeekday(date);
    } else {
      return formatDate(date);
    }
  }
  

  return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white w-full max-w-sm border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
            isSidebarOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="mt-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search or start new chat" 
                    className="pl-10 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-green-100 focus:ring-offset-2" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
          </div>
          {!searchQuery && (
                <Button
                  variant={showArchived ? "default" : "ghost"}
                  className="w-full py-6 text-left border justify-center"
                  onClick={() => setShowArchived(!showArchived)}
                >
                <Archive className="h-6 w-6 mr-2" />
                {showArchived ? "Show Active Chats" : "Show Archived Chats"}
              </Button>
            )}       

          {loadFailed === true ? (
            <div className="flex justify-center items-center h-[calc(100vh-86px)]">
              <p className="text-lg font-semibold text-gray-500">Failed to load contacts</p>
            </div>
          ) : (
            <ScrollArea className="flex-grow">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center space-x-4 p-4 hover:bg-gray-100 transition-colors duration-200 border-b cursor-pointer",
                    {
                      "bg-green-100 hover:bg-green-200":
                        contact.phone_number === selectedChat?.phone_number,
                    }
                  )}
                  onClick={() => handleChatSelect(contact)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userIcon.src} alt={`Contact ${i + 1}`} />
                    <AvatarFallback>{contact.phone_number}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {contact.phone_number}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      <span className={contact.message.role === "assistant" ? "font-bold" : ""}>
                        {contact.message.role === "assistant" ? "You: " : ""}
                      </span>
                      {contact.message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(contact.timestamp)}
                    </span>
                    {contact.unread_count !== 0 && (
                      <span className="bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5 mt-1">
                        {contact.unread_count}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click from bubbling up to the parent
                      toggleArchiveChat(contact);
                    }}
                    className="ml-2 hover:bg-gray-300"
                  >
                    {contact.is_archived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {contact.is_archived ? "Unarchive" : "Archive"} chat
                    </span>
                  </Button>
                </div>
              ))
            ) : (
              searchQuery && ( // Check if searchQuery exists
                <div
                  className="p-4"
                  onClick={() =>
                    handleChatSelect({
                      phone_number: searchQuery,
                      is_archived: false,
                      message: "",
                      unread_count: 0,
                    })
                  }
                >
                  <div className="flex items-center space-x-4 p-6 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 border-b cursor-pointer">
                    <MessageCircle />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{searchQuery || "New Contact"}</p>
                      <p className="text-sm text-gray-300">Start a new conversation</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </ScrollArea>
          )}
          <div className="px-4 py-6 border-t border-gray-200 bg-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Let GPT Answer</span>
              <Switch
                checked={isGPTEnabled}
                onCheckedChange={(event) => toggleGPT(event)}
                aria-label="Toggle GPT Answer"
              />
            </div>
          </div>
        </div>

        { selectedChat ? <>
          <Chat key={selectedChat.phone_number} contact={selectedChat} toggleSidebar={toggleSidebar} fetchContacts={fetchContacts}/>
        </> : <>
                
          <div className="flex-1 flex flex-col">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex-1 flex items-center justify-center">
              Please select a chat to view the messages
            </div>
          </div>
              
        </>}

      </div>
  )
}