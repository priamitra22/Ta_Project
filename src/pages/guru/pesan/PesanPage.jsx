import { useState, useEffect, useMemo } from 'react';
import { FaComments, FaUser, FaPaperPlane, FaSearch, FaEllipsisV, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { useNotification } from '../../../hooks/useNotification';

export default function PesanPage() {
  // ===== HOOKS =====
  const { showSuccessMessage } = useNotification();


  // State untuk pesan
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  // State untuk UI
  const [showSearch, setShowSearch] = useState(false);

  // ===== SAMPLE DATA =====
  const sampleConversations = useMemo(() => [
    {
      id: 1,
      contactName: "Bapak Rudi (Orang Tua)",
      contactType: "Orang Tua",
      lastMessage: "Sama-sama, silahkan...",
      lastMessageTime: "10:30 AM",
      unreadCount: 3,
      isOnline: true,
      avatar: "R",
      messages: [
        {
          id: 1,
          text: "Terima kasih atas perhatiannya",
          time: "10:30 AM",
          isIncoming: true,
          status: "dibaca"
        },
        {
          id: 2,
          text: "Sama-sama, silakan hubungi saya jika ada yang perlu didiskusikan lagi.",
          time: "10:30 AM",
          isIncoming: false,
          status: "terkirim"
        }
      ]
    },
    {
      id: 2,
      contactName: "Bapak Rudi (Orang Tua)",
      contactType: "Orang Tua",
      lastMessage: "Terima kasih atas...",
      lastMessageTime: "09:15 AM",
      unreadCount: 0,
      isOnline: false,
      avatar: "R",
      messages: [
        {
          id: 1,
          text: "Terima kasih atas informasi yang diberikan",
          time: "09:15 AM",
          isIncoming: true,
          status: "dibaca"
        }
      ]
    },
    {
      id: 3,
      contactName: "Bapak Rudi (Orang Tua)",
      contactType: "Orang Tua",
      lastMessage: "Baik, akan saya sampaikan...",
      lastMessageTime: "08:45 AM",
      unreadCount: 0,
      isOnline: false,
      avatar: "R",
      messages: [
        {
          id: 1,
          text: "Baik, akan saya sampaikan kepada anak saya",
          time: "08:45 AM",
          isIncoming: true,
          status: "dibaca"
        }
      ]
    },
    {
      id: 4,
      contactName: "Bapak Rudi (Orang Tua)",
      contactType: "Orang Tua",
      lastMessage: "Mohon maaf atas keterlambatan...",
      lastMessageTime: "Kemarin",
      unreadCount: 0,
      isOnline: false,
      avatar: "R",
      messages: [
        {
          id: 1,
          text: "Mohon maaf atas keterlambatan dalam pembayaran",
          time: "Kemarin",
          isIncoming: true,
          status: "dibaca"
        }
      ]
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    // Set conversation pertama sebagai default
    if (sampleConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(sampleConversations[0]);
    }
  }, [sampleConversations, selectedConversation]);

  // ===== COMPUTED VALUES =====
  const filteredConversations = useMemo(() => 
    sampleConversations.filter(conv =>
      conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    ), [sampleConversations, searchQuery]
  );

  // ===== HANDLERS =====
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Reset unread count dengan cara yang aman
    const updatedConversation = {
      ...conversation,
      unreadCount: 0
    };
    setSelectedConversation(updatedConversation);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      time: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isIncoming: false,
      status: 'terkirim'
    };

    // Update conversation dengan pesan baru
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: newMsg.time,
      messages: [...selectedConversation.messages, newMsg]
    };

    // Update selected conversation
    setSelectedConversation(updatedConversation);

    // Clear input
    setNewMessage('');
    
    showSuccessMessage("Pesan berhasil dikirim");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timeString) => {
    const now = new Date();
    const messageTime = new Date();
    
    if (timeString === 'Kemarin') {
      return 'Kemarin';
    }
    
    // Parse time string (e.g., "10:30 AM")
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      messageTime.setHours(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      messageTime.setHours(0);
    } else {
      messageTime.setHours(parseInt(hours));
    }
    messageTime.setMinutes(parseInt(minutes));
    
    // Check if it's today
    if (messageTime.toDateString() === now.toDateString()) {
      return timeString;
    } else {
      return messageTime.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto">

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex h-[600px]">
          
          {/* Left Panel - Daftar Pesan */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50">
            {/* Header Daftar Pesan */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Pesan</h2>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
              
              {/* Search Bar */}
              {showSearch && (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Cari kontak..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Conversation List */}
            <div className="overflow-y-auto h-[calc(600px-80px)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-100 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {conversation.contactName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      
                      {/* Unread Badge */}
                      {conversation.unreadCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600 font-medium">
                            {conversation.contactType}
                          </span>
                          <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Conversation View */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {selectedConversation.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.contactName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.contactType}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isIncoming
                            ? 'bg-white border border-gray-200'
                            : 'bg-blue-600 text-white'
                        }`}>
                          <p className="text-sm mb-1">{message.text}</p>
                          <div className={`flex items-center gap-2 text-xs ${
                            message.isIncoming ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                            <span>{message.time}</span>
                            {!message.isIncoming && (
                              <span className="flex items-center gap-1">
                                {message.status === 'terkirim' ? (
                                  <FaCheck className="w-3 h-3" />
                                ) : message.status === 'dibaca' ? (
                                  <FaCheckDouble className="w-3 h-3" />
                                ) : (
                                  <FaCheck className="w-3 h-3" />
                                )}
                                {message.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        rows={1}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <FaPaperPlane className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FaComments className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Percakapan</h3>
                  <p className="text-gray-500">Pilih kontak dari daftar untuk memulai percakapan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
