import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Heart, AlertTriangle, Clock } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  functionCalls?: any[];
  isTyping?: boolean;
}

interface GeminiChatProps {
  onEmergencyAlert?: (data: any) => void;
}

const GeminiBloodMatchingChat: React.FC<GeminiChatProps> = ({ onEmergencyAlert }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Blood Matching Assistant. I can help you:\n\n• Find compatible blood donors urgently\n• Locate nearby blood drives\n• Check blood type compatibility\n• Register emergency blood requests\n• Provide blood donation guidance\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      role: 'assistant',
      content: 'AI is thinking...',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('http://localhost:3002/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          functionCalls: data.functionCalls
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationHistory(data.conversationHistory || []);

        // Check if this was an emergency request
        if (data.functionCalls?.some((call: any) => call.name === 'registerEmergencyRequest')) {
          onEmergencyAlert?.(data.functionCalls.find((call: any) => call.name === 'registerEmergencyRequest'));
        }

      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support if the issue persists.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderFunctionCallResults = (functionCalls: any[]) => {
    return functionCalls.map((call, index) => (
      <div key={index} className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-700 capitalize">
            {call.name.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </span>
        </div>
        
        {call.response.success ? (
          <div className="space-y-2">
            {call.name === 'findCompatibleDonors' && (
              <div>
                <p className="text-sm text-gray-600">
                  Found {call.response.totalFound} compatible donors for {call.response.requiredBloodType} blood
                </p>
                {call.response.compatibleDonors.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {call.response.compatibleDonors.slice(0, 3).map((donor: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white border rounded text-xs">
                        <div className="font-medium">{donor.bloodType}</div>
                        <div className="text-gray-500">{donor.location}</div>
                        <div className="text-green-600">Contact available</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {call.name === 'findBloodDrives' && (
              <div>
                <p className="text-sm text-gray-600">
                  Found {call.response.totalFound} upcoming blood drives
                </p>
                {call.response.bloodDrives.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {call.response.bloodDrives.slice(0, 2).map((drive: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white border rounded text-xs">
                        <div className="font-medium">{drive.title}</div>
                        <div className="text-gray-500">{drive.location}</div>
                        <div className="text-blue-600">{drive.event_date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {call.name === 'registerEmergencyRequest' && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Emergency Request #{call.response.requestId}
                  </p>
                  <p className="text-xs text-red-600">
                    {call.response.bloodType} blood needed at {call.response.hospitalName}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-600">Error: {call.response.error}</p>
        )}
      </div>
    ));
  };

  const getMessageIcon = (role: string, isTyping?: boolean) => {
    if (isTyping) return <Clock className="w-4 h-4 text-gray-400 animate-pulse" />;
    return role === 'user' ? 
      <User className="w-4 h-4 text-blue-600" /> : 
      <Heart className="w-4 h-4 text-red-500" />;
  };

  const suggestedQueries = [
    "I need O- blood urgently at City Hospital",
    "Find blood drives in Mumbai this month",
    "What blood types can AB+ receive from?",
    "Register emergency request for B+ blood"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Lifeline AI Assistant</h2>
            <p className="text-red-100 text-sm">Powered by Gemini AI • Blood Matching & Emergency Response</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                {getMessageIcon(message.role, message.isTyping)}
              </div>
              
              <div className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isTyping
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-white border shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                
                {message.functionCalls && message.functionCalls.length > 0 && (
                  <div className="mt-2">
                    {renderFunctionCallResults(message.functionCalls)}
                  </div>
                )}
                
                <div className={`text-xs mt-2 opacity-70 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(query)}
                className="text-left p-2 text-xs bg-white border border-gray-200 rounded hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                "{query}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about blood donations, emergency requests, or find donors..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {isLoading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiBloodMatchingChat;
