'use client'
import ChatInterface from "@/components/ChatInterface"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect } from "react"

export default function Home() {
  
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
}
})
  
  return (
    <ProtectedRoute>
      <ChatInterface></ChatInterface>
    </ProtectedRoute>
  )
}