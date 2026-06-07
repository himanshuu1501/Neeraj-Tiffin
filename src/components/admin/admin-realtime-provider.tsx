"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useAdminOrderNotifications } from "@/hooks/use-admin-order-notifications";

interface AdminRealtimeContextValue {
  unreadCount: number;
  markOrdersAsRead: () => void;
}

const AdminRealtimeContext = createContext<AdminRealtimeContextValue>({
  unreadCount: 0,
  markOrdersAsRead: () => {},
});

export function useAdminRealtime() {
  return useContext(AdminRealtimeContext);
}

export function AdminRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const markOrdersAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useAdminOrderNotifications({
    onNewOrder: () => {
      setUnreadCount((count) => count + 1);
    },
  });

  useEffect(() => {
    if (pathname.startsWith("/admin/orders")) {
      markOrdersAsRead();
    }
  }, [pathname, markOrdersAsRead]);

  return (
    <AdminRealtimeContext.Provider value={{ unreadCount, markOrdersAsRead }}>
      {children}
    </AdminRealtimeContext.Provider>
  );
}
