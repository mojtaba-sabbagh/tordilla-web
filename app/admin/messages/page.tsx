// app/admin/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Reply, Archive, Trash2, RefreshCw, Mail, Phone, User, Calendar } from 'lucide-react';
import AdminNav from '../components/AdminNav'; // Import the nav component

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'UNSEEN' | 'SEEN' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnseenCount();
  }, [selectedStatus]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages?status=${selectedStatus}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnseenCount = async () => {
    try {
      const response = await fetch('/api/admin/messages/unseen-count');
      if (response.ok) {
        const data = await response.json();
        setUnseenCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unseen count:', error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchMessages();
      fetchUnseenCount();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: status as any });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      fetchMessages();
      fetchUnseenCount();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      UNSEEN: 'bg-red-100 text-red-800',
      SEEN: 'bg-yellow-100 text-yellow-800',
      REPLIED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };
    const texts = {
      UNSEEN: 'خوانده نشده',
      SEEN: 'خوانده شده',
      REPLIED: 'پاسخ داده شده',
      ARCHIVED: 'بایگانی',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {texts[status as keyof typeof texts]}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <AdminNav unseenMessagesCount={unseenCount} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#8f1d1d]">مدیریت پیام‌ها</h1>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-4 py-2 bg-[#8f1d1d] text-white rounded-lg hover:bg-[#6b1616] transition"
          >
            <RefreshCw className="h-5 w-5" />
            بروزرسانی
          </button>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['ALL', 'UNSEEN', 'SEEN', 'REPLIED', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedStatus === status
                  ? 'bg-[#8f1d1d] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'ALL' ? 'همه' : status === 'UNSEEN' ? 'خوانده نشده' : status === 'SEEN' ? 'خوانده شده' : status === 'REPLIED' ? 'پاسخ داده شده' : 'بایگانی'}
              {status !== 'ALL' && (
                <span className="mr-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {messages.filter(m => m.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Messages List and Detail View */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-bold text-lg">لیست پیام‌ها</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">پیامی وجود ندارد</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 border-r-4 border-[#8f1d1d]' : ''
                    } ${message.status === 'UNSEEN' ? 'bg-red-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{message.message}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{formatDate(message.createdAt)}</span>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => updateStatus(message.id, 'SEEN')}
                          className="p-1 hover:text-blue-600"
                          title="علامت خوانده شده"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(message.id, 'REPLIED')}
                          className="p-1 hover:text-green-600"
                          title="پاسخ داده شده"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-1 hover:text-red-600"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-bold text-lg">جزئیات پیام</h2>
            </div>
            {selectedMessage ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-5 w-5 text-[#8f1d1d]" />
                      <span className="font-medium">نام:</span>
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-5 w-5 text-[#8f1d1d]" />
                      <span className="font-medium">ایمیل:</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-5 w-5 text-[#8f1d1d]" />
                        <span className="font-medium">تلفن:</span>
                        <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-5 w-5 text-[#8f1d1d]" />
                      <span className="font-medium">تاریخ:</span>
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">متن پیام:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=پاسخ به پیام شما: ${selectedMessage.subject}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Reply className="h-5 w-5" />
                    پاسخ با ایمیل
                  </button>
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'ARCHIVED')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <Archive className="h-5 w-5" />
                    بایگانی
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                برای مشاهده جزئیات، روی یک پیام کلیک کنید
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}