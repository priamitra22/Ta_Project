import { useState, useEffect, useMemo } from 'react';
import { FaComments, FaUser, FaPaperPlane, FaSearch, FaEllipsisV, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { useNotification } from '../../../hooks/useNotification';

export default function PesanOrangTuaPage() {
  // ===== HOOKS =====
  const { showInfoMessage } = useNotification();

  // ===== STATES =====
  // State untuk chat
  
  // State untuk chat
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // ===== SAMPLE DATA =====
  const sampleConversations = useMemo(() => [
    {
      id: 1,
      name: "Bapak Firman",
      avatar: "👨‍🏫",
      lastMessage: "Baik Pa, Terimakasih...",
      timestamp: "10:30 AM",
      unreadCount: 2,
      isOnline: true,
      role: "Wali Kelas 1A"
    },
    {
      id: 2,
      name: "Bapak Sandi",
      avatar: "👨‍🏫",
      lastMessage: "Terima kasih atas...",
      timestamp: "09:15 AM",
      unreadCount: 1,
      isOnline: false,
      role: "Guru Matematika"
    },
    {
      id: 3,
      name: "Ibu Sari",
      avatar: "👩‍🏫",
      lastMessage: "Anak Anda sudah...",
      timestamp: "Kemarin",
      unreadCount: 0,
      isOnline: false,
      role: "Guru Bahasa Indonesia"
    },
    {
      id: 4,
      name: "Bapak Rudi",
      avatar: "👨‍🏫",
      lastMessage: "Laporan nilai sudah...",
      timestamp: "2 hari lalu",
      unreadCount: 0,
      isOnline: false,
      role: "Guru IPA"
    }
  ], []);

  const sampleMessages = useMemo(() => [
    {
      id: 1,
      conversationId: 1,
      sender: "Bapak Firman",
      message: "Selamat pagi, Ibu/Bapak. Saya Pa Firman, wali kelas anak Anda, Dinda",
      timestamp: "10:30 AM",
      isRead: true,
      isOutgoing: false,
      date: "Rabu, 25 Juni"
    },
    {
      id: 2,
      conversationId: 1,
      sender: "Orang Tua",
      message: "Baik Pa, terima kasih banyak atas informasinya.",
      timestamp: "10:30 AM",
      isRead: true,
      isOutgoing: true,
      date: "Rabu, 25 Juni"
    },
    {
      id: 3,
      conversationId: 1,
      sender: "Bapak Firman",
      message: "Sama-sama. Jika ada yang ingin ditanyakan, silakan hubungi saya.",
      timestamp: "10:32 AM",
      isRead: false,
      isOutgoing: false,
      date: "Rabu, 25 Juni"
    },
    {
      id: 4,
      conversationId: 1,
      sender: "Bapak Firman",
      message: "Anak Anda menunjukkan kemajuan yang baik dalam pembelajaran.",
      timestamp: "10:33 AM",
      isRead: false,
      isOutgoing: false,
      date: "Rabu, 25 Juni"
    }
  ], []);

  // ===== INITIALIZE DATA =====
  useEffect(() => {
    if (sampleConversations.length > 0) {
      setSelectedConversation(sampleConversations[0]);
    }
  }, [sampleConversations]);

  // ===== COMPUTED VALUES =====
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return sampleConversations;
    return sampleConversations.filter(conversation =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sampleConversations, searchQuery]);

  const currentMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return sampleMessages.filter(msg => msg.conversationId === selectedConversation.id);
  }, [selectedConversation, sampleMessages]);



  // ===== HANDLERS =====
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Show chat view on mobile
    setShowChat(true);
    // Reset unread count when selecting conversation
    if (conversation.unreadCount > 0) {
      // In real app, this would update the backend
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;



    // In real app, this would be sent to backend
    showInfoMessage("Pesan berhasil dikirim");
    setNewMessage('');
  };



  // ===== RENDER =====
  return (
    <div className="max-w-7xl mx-auto h-screen">
      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
        {/* Mobile: Show conversation list or chat based on state */}
        <div className={`h-full ${showChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Left Panel - Conversation List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Pesan</h2>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
              
              {showSearch && (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Cari percakapan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Conversation List */}
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500">{conversation.role}</p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Chat View */}
          <div className="flex-1 flex flex-col hidden md:flex">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation.role}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaSearch className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {currentMessages.map((message, index) => (
                    <div key={message.id}>
                      {/* Date Separator */}
                      {index === 0 || currentMessages[index - 1].date !== message.date ? (
                        <div className="text-center my-4">
                          <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                            {message.date}
                          </span>
                        </div>
                      ) : null}

                      {/* Message */}
                      <div className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOutgoing 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center gap-2 mt-1 text-xs ${
                            message.isOutgoing ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.isOutgoing && (
                              <span>
                                {message.isRead ? <FaCheckDouble className="w-3 h-3" /> : <FaCheck className="w-3 h-3" />}
                              </span>
                            )}
                            {!message.isOutgoing && message.isRead && (
                              <span>Dibaca</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Ketik pesan..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-gray-500">Pilih percakapan dari daftar untuk mulai chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Chat View */}
        {showChat && selectedConversation && (
          <div className="h-full md:hidden">
            {/* Chat Header with Back Button */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ←
                </button>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-500">{selectedConversation.role}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaSearch className="w-4 h-4" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaEllipsisV className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {currentMessages.map((message, index) => (
                <div key={message.id}>
                  {/* Date Separator */}
                  {index === 0 || currentMessages[index - 1].date !== message.date ? (
                    <div className="text-center my-4">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                        {message.date}
                      </span>
                    </div>
                  ) : null}

                  {/* Message */}
                  <div className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOutgoing 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${
                        message.isOutgoing ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp}</span>
                        {message.isOutgoing && (
                          <span>
                            {message.isRead ? <FaCheckDouble className="w-3 h-3" /> : <FaCheck className="w-3 h-3" />}
                          </span>
                        )}
                        {!message.isOutgoing && message.isRead && (
                          <span>Dibaca</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
