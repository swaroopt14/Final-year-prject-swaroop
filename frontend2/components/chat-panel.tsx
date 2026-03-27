'use client'

import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { AgentTag } from './agent-tag'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  agent?: 'Doctor' | 'Nurse' | 'Drug' | 'Admin'
  timestamp: string
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Patient P-2847 shows critical sepsis indicators. Recommend immediate broad-spectrum antibiotic therapy and ICU monitoring.',
      agent: 'Doctor',
      timestamp: '2 mins ago',
    },
    {
      id: '2',
      type: 'user',
      content: 'What are the recommended antibiotics?',
      timestamp: '1 min ago',
    },
    {
      id: '3',
      type: 'assistant',
      content: '• Ceftriaxone 2g IV q12h\n• Vancomycin 15-20mg/kg IV q8-12h\n• Gentamicin 7mg/kg IV daily\n\nMonitor renal function closely. Adjust for any organ dysfunction detected.',
      agent: 'Doctor',
      timestamp: 'now',
    },
  ])

  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: String(messages.length + 1),
      type: 'user',
      content: input,
      timestamp: 'now',
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        type: 'assistant',
        content: 'I have processed your query. The system is monitoring the situation and will alert if there are any critical changes.',
        agent: 'Doctor',
        timestamp: 'now',
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0 shadow-lg">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-xs px-4 py-2.5 rounded-lg text-sm
                ${
                  message.type === 'user'
                    ? 'bg-primary text-white rounded-br-none shadow-md'
                    : 'bg-white border border-gray-200 text-foreground rounded-bl-none shadow-sm'
                }
              `}
            >
              {message.type === 'assistant' && message.agent && (
                <div className="mb-2">
                  <AgentTag agent={message.agent} size="sm" />
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="h-24 border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the AI..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
