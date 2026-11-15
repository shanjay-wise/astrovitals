import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles, X, Send, Bot, AlertTriangle, ShieldCheck,
  ChevronDown, Heart, Moon, Dumbbell, Droplets, RefreshCw
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'
import { geminiApiService } from '../../services/geminiApi'

const QUICK_CHIPS = [
  'Why is my HR high?',
  'Plan my day',
  'Improve my sleep',
  'Check radiation risk',
  'SANS optic check'
]

export default function AIAssistantBubble() {
  const {
    isAiBubbleOpen,
    setAiBubbleOpen,
    aiPulseSeverity,
    setAiPulseSeverity,
    astronauts,
    selectedAstronautId,
    currentVitals,
    alerts
  } = useAstroStore()

  const currentAstro = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0]
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${currentAstro.name}. I am AstroAI, your flight bio-informatics decision support assistant. Telemetry is nominal across main telemetry channels. How can I assist your mission timeline today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatBottomRef = useRef(null)

  // Auto-scroll on new message
  useEffect(() => {
    if (isAiBubbleOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAiBubbleOpen])

  // Clear pulse when user opens bubble
  const handleOpenBubble = () => {
    setAiBubbleOpen(true)
    setAiPulseSeverity(null)
  }

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await geminiApiService.askAssistant(query, currentAstro, currentVitals, alerts)
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to process query at this time. Telemetry monitoring remains active.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40">
      {/* Floating Trigger Bubble */}
      {!isAiBubbleOpen ? (
        <button
          onClick={handleOpenBubble}
          className={`relative min-w-[50px] min-h-[50px] p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
            aiPulseSeverity === 'critical'
              ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400'
              : aiPulseSeverity === 'caution'
              ? 'bg-amber-500 text-white animate-bounce ring-4 ring-amber-300'
              : 'bg-nasa-blue text-white dark:bg-nasa-blueLight dark:text-space-950 hover:shadow-nasa-blue/40'
          }`}
          title="Open AstroAI Health Assistant"
          aria-label="Open AstroAI Health Assistant"
        >
          <Bot className="w-7 h-7" />
          {/* Status Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-space-900 rounded-full" />
        </button>
      ) : (
        /* Expanded Chat Panel */
        <div className="w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[420px] h-[520px] max-h-[calc(100dvh-5.5rem)] bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-nasa-blue to-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="heading-display text-xs sm:text-sm font-bold tracking-wide truncate">ASTRO-AI ASSISTANT</h3>
                  <span className="text-[9px] px-1 rounded bg-emerald-500/30 text-emerald-300 font-semibold shrink-0">
                    AUTONOMOUS
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 truncate">
                  Active Subject: {currentAstro.name} • NASA-STD-3001
                </p>
              </div>
            </div>

            <button
              onClick={() => setAiBubbleOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-blue-200 hover:text-white transition-colors shrink-0"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prioritized Clinical Next Steps Strip */}
          <div className="px-3 py-2 bg-blue-50 dark:bg-space-800 border-b border-blue-100 dark:border-space-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-nasa-blue dark:text-nasa-blueLight font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prioritized Directive:</span>
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-300 truncate max-w-[210px]">
              {alerts.length > 0 ? alerts[0].recommendation : 'Complete mandatory 2.5h ARED exercise'}
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-nasa-blue text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-space-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-space-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-nasa-blue" />
                <span>Evaluating bio-telemetry channels...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 bg-gray-50 dark:bg-space-800/60 border-t border-gray-200 dark:border-space-700 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="min-h-[38px] px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-space-700 hover:bg-gray-100 dark:hover:bg-space-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-space-600 whitespace-nowrap transition-colors flex items-center shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Send */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-2.5 bg-white dark:bg-space-900 border-t border-gray-200 dark:border-space-700 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AstroAI medical assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm bg-gray-100 dark:bg-space-800 border border-gray-200 dark:border-space-700 text-gray-900 dark:text-white focus:outline-none focus:border-nasa-blue"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl bg-nasa-blue text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Visible Disclaimer as Required */}
          <div className="px-3 py-1 bg-gray-100 dark:bg-space-950 text-[9px] text-gray-500 text-center border-t border-gray-200 dark:border-space-800">
            ⚠️ <strong>Decision Support Only</strong>: Not a certified medical diagnosis. Always cross-verify with Mission Control Flight Surgeon.
          </div>
        </div>
      )}
    </div>
  )
}
