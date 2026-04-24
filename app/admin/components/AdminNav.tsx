// app/admin/components/AdminNav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Mail, LayoutDashboard, LogOut } from 'lucide-react';

interface AdminNavProps {
  unseenMessagesCount?: number;
  pendingCommentsCount?: number;
}

export default function AdminNav({ unseenMessagesCount = 0, pendingCommentsCount = 0 }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const navItems = [
    {
      href: '/admin',
      label: 'داشبورد',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: '/admin/messages',
      label: 'پیام‌ها',
      icon: Mail,
      badge: unseenMessagesCount > 0 ? unseenMessagesCount : null,
    },
    {
      href: '/admin/comments',
      label: 'نظرات',
      icon: MessageSquare,
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : null,
    },
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#8f1d1d]">پنل مدیریت</h1>
              <span className="text-sm text-neutral-500 hidden sm:inline">ترددیلا</span>
            </div>
            
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-lg ${
                      isActive
                        ? 'text-[#8f1d1d] bg-[#8f1d1d]/10'
                        : 'text-neutral-700 hover:text-[#8f1d1d] hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-[#8f1d1d] transition rounded-lg hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            خروج
          </button>
        </div>
      </div>
    </div>
  );
}