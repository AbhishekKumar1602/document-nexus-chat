import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableRenderer } from './TableRenderer';
import { parseMarkdownTable, hasMarkdownTable } from '@/utils/tableParser';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Globe, 
  Upload,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatMode = 'workspace' | 'general' | 'temp-docs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode: ChatMode;
  sources?: string[];
}

export const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name}! I'm your AI assistant. I can help you with:

• **Workspace Chat** - Query documents in your active workspace
• **General Chat** - General AI assistance without document context
• **Temporary Docs** - Upload files for isolated Q&A sessions (coming soon)

How can I help you today?`,
      timestamp: new Date(),
      mode: 'workspace'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>('workspace');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      mode: chatMode
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(newMessage, chatMode),
        timestamp: new Date(),
        mode: chatMode,
        sources: chatMode === 'workspace' ? ['Document_1.pdf', 'Research_Notes.md'] : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string, mode: ChatMode): string => {
    if (mode === 'workspace') {
      return `Based on the documents in your workspace, I found relevant information about "${query}". Here's what I can tell you:

This information comes from your workspace documents and is specifically tailored to your team's knowledge base. The context includes recent uploads and shared documents that are relevant to your query.

Would you like me to elaborate on any specific aspect or help you find more related information?`;
    }
    
    if (mode === 'general') {
      return `I'd be happy to help you with "${query}". As a general AI assistant, I can provide information and assistance on a wide range of topics.

This response doesn't use any document context from your workspace - it's based on my general training knowledge. If you'd like me to search through your workspace documents instead, please switch to "Workspace Chat" mode.

How else can I assist you today?`;
    }

    return `I understand you're asking about "${query}". The temporary documents feature will allow you to upload files for isolated Q&A sessions without adding them to your permanent workspace. This feature is coming soon!`;
  };

  const getModeIcon = (mode: ChatMode) => {
    switch (mode) {
      case 'workspace': return <FileText className="h-4 w-4" />;
      case 'general': return <Globe className="h-4 w-4" />;
      case 'temp-docs': return <Upload className="h-4 w-4" />;
    }
  };

  const getModeDescription = (mode: ChatMode) => {
    switch (mode) {
      case 'workspace': return `Searching in: ${user?.activeWorkspace ? 'Research Team' : 'No workspace'} documents`;
      case 'general': return 'General AI assistance without document context';
      case 'temp-docs': return 'Upload files for isolated Q&A (Coming Soon)';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Mode Selector */}
      <Card className="mb-6 bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat Mode</CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <Select value={chatMode} onValueChange={(value: ChatMode) => setChatMode(value)}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                {getModeIcon(chatMode)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workspace">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Workspace Chat
                </div>
              </SelectItem>
              <SelectItem value="general">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  General Chat
                </div>
              </SelectItem>
              <SelectItem value="temp-docs" disabled>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Temporary Docs (Coming Soon)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            {getModeDescription(chatMode)}
          </p>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col bg-gradient-card border-border/50">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-gradient-primary">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                 <div className={cn(
                   "max-w-[70%] rounded-lg px-4 py-3",
                   message.role === 'user' 
                     ? "bg-primary text-primary-foreground ml-12" 
                     : "bg-muted"
                 )}>
                   {message.role === 'assistant' && hasMarkdownTable(message.content) ? (
                     <div>
                       {(() => {
                         const tableData = parseMarkdownTable(message.content);
                         const parts = message.content.split(/\|(.+)\|\n\|[\s\-\|:]+\|\n((?:\|.+\|\n?)+)/);
                         const beforeTable = parts[0]?.trim();
                         const afterTable = parts[3]?.trim();
                         
                         return (
                           <>
                             {beforeTable && (
                               <div className="whitespace-pre-wrap text-sm mb-4">
                                 {beforeTable}
                               </div>
                             )}
                             {tableData && <TableRenderer data={tableData} />}
                             {afterTable && (
                               <div className="whitespace-pre-wrap text-sm mt-4">
                                 {afterTable}
                               </div>
                             )}
                           </>
                         );
                       })()}
                     </div>
                   ) : (
                     <div className="whitespace-pre-wrap text-sm">
                       {message.content}
                     </div>
                   )}
                  
                  {message.sources && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {message.sources.map((source, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    {getModeIcon(message.mode)}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()} • {message.mode.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 bg-gradient-primary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-white animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="bg-gradient-primary hover:bg-gradient-primary-hover shadow-elegant"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};