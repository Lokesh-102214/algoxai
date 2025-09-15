import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Bot, User, Sparkles, X, MessageCircle } from 'lucide-react';
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'ai',
    content: 'Hi! I\'m your CP Learning Assistant. I can help you understand algorithms, debug code, suggest practice problems, and explain concepts. What would you like to learn today?',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const predefinedResponses = {
    'dynamic programming': 'Dynamic Programming is perfect for problems with overlapping subproblems! Start with the classic Fibonacci example, then try the 0/1 Knapsack problem. The key is to identify the optimal substructure and store results to avoid recomputation.',
    'graph algorithms': 'Graph algorithms are essential for competitive programming! BFS is great for shortest paths in unweighted graphs, while DFS helps with connectivity problems. Try implementing both and practice on tree traversal problems first.',
    'time complexity': 'Time complexity analysis is crucial! Here\'s a quick guide:\n• O(1) - Constant time\n• O(log n) - Logarithmic (binary search)\n• O(n) - Linear\n• O(n log n) - Divide & conquer (merge sort)\n• O(n²) - Nested loops\n\nAlways aim for the most efficient solution!',
    'practice problems': 'Great question! Start with:\n• Easy: Two Sum, Valid Parentheses, Binary Search\n• Medium: Longest Substring, House Robber, Course Schedule\n• Hard: Merge k Sorted Lists, Word Ladder, N-Queens\n\nFocus on one topic at a time and gradually increase difficulty!',
    'debugging tips': 'Here are my top debugging tips:\n1. Add print statements to trace execution\n2. Check edge cases (empty input, single element)\n3. Verify array bounds and null pointers\n4. Test with small examples first\n5. Use a debugger to step through code\n6. Review the problem constraints again',
    'hello': 'Hello! I\'m excited to help you with competitive programming. Whether you need algorithm explanations, coding help, or practice suggestions, I\'m here for you!',
    'help': 'I can assist you with:\n🧠 Algorithm explanations and examples\n💻 Code debugging and optimization\n📚 Concept clarification\n🎯 Practice problem recommendations\n🏆 Contest strategy tips\n📊 Complexity analysis\n\nJust ask me anything!',
    'greedy': 'Greedy algorithms make locally optimal choices! The activity selection problem is a perfect example. Key insight: sort by finish time and always pick the activity that finishes earliest. Works great for optimization problems with the greedy choice property.',
    'sorting': 'Sorting is fundamental! Quick Sort (O(n log n) average) uses divide-and-conquer with partitioning. Merge Sort (O(n log n) always) is stable and predictable. For small ranges, try Counting Sort (O(n+k)). Practice implementing each from scratch!',
    'binary search': 'Binary Search is powerful beyond just searching! Use it for "search for answer" problems. Template: while(left <= right) { mid = left + (right-left)/2; ... }. Remember to handle overflow and consider edge cases. Try problems like sqrt(x) or painter partition!',
    'backtracking': 'Backtracking explores all possibilities systematically! N-Queens is the classic example. Pattern: make a choice, recurse, then undo the choice. Use pruning to avoid invalid states early. Great for constraint satisfaction and combinatorial problems.'
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Find matching predefined response
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default responses for common patterns
    if (lowerMessage.includes('complexity') || lowerMessage.includes('big o')) {
      return predefinedResponses['time complexity'];
    }
    if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      return predefinedResponses['debugging tips'];
    }
    if (lowerMessage.includes('practice') || lowerMessage.includes('problem')) {
      return predefinedResponses['practice problems'];
    }

    // Generic helpful response
    return 'That\'s an interesting question! While I\'d love to give you a detailed answer, I\'m still learning. For now, I can help you with algorithm concepts, debugging tips, and practice problem suggestions. Try asking about specific algorithms like "dynamic programming" or "graph algorithms"!';
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input would be implemented here with Web Speech API
    // For demo purposes, we'll just toggle the state
    setTimeout(() => setIsListening(false), 3000);
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && <Button onClick={() => setIsOpen(true)} data-ai-assistant className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[var(--shadow-glow-primary)] hover:shadow-[var(--shadow-glow-secondary)] transition-all duration-300 hover:scale-110 text-white">
          <MessageCircle className="w-8 h-8 fill-current" />
        </Button>}

      {/* Chat Interface */}
      {isOpen && <Card className="w-96 h-[600px] flex flex-col bg-background/95 backdrop-blur-xl border border-primary/20 shadow-[var(--shadow-glow-primary)] animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">CP Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(message => <div key={message.id} className={`flex gap-3 animate-fade-in-up ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>}
                  
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-foreground'}`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.type === 'user' && <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>}
                </div>)}

              {/* Typing Indicator */}
              {isTyping && <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{
                  animationDelay: '0.1s'
                }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{
                  animationDelay: '0.2s'
                }}></div>
                    </div>
                  </div>
                </div>}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about algorithms, debugging, or practice problems..." className="pr-12 bg-muted/50 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary" />
                <Button variant="ghost" size="icon" onClick={handleVoiceInput} className={`absolute right-1 top-1 h-8 w-8 ${isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="h-10 w-10 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary shadow-[var(--shadow-glow-primary)] transition-all duration-300">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>}
    </div>;
};
export default AIAssistant;