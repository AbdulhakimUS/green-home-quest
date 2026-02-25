import { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Bell, X, ShoppingCart, Gift, Wifi, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export type NotificationType = "purchase" | "sale" | "mission" | "reconnect" | "admin" | "warning";

export interface GameNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  important?: boolean;
}

interface NotificationsContextType {
  notifications: GameNotification[];
  addNotification: (type: NotificationType, title: string, message: string, important?: boolean) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);

  const addNotification = useCallback((type: NotificationType, title: string, message: string, important?: boolean) => {
    const newNotif: GameNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      important: important || false,
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50); // Keep max 50
      return updated;
    });

    // Auto-remove non-important after 30 seconds
    if (!important) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id || n.important));
      }, 30000);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markAllRead, clearAll, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "purchase": return <ShoppingCart className="w-4 h-4 text-primary" />;
    case "sale": return <ShoppingCart className="w-4 h-4 text-success" />;
    case "mission": return <Gift className="w-4 h-4 text-warning" />;
    case "reconnect": return <Wifi className="w-4 h-4 text-info" />;
    case "admin": return <MessageSquare className="w-4 h-4 text-primary" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-destructive" />;
  }
};

const formatTime = (ts: number) => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}с назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
  return `${Math.floor(diff / 3600)}ч назад`;
};

export const NotificationsPanel = () => {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => {
          setOpen(!open);
          if (!open) markAllRead();
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold text-sm">Уведомления</h3>
              <div className="flex gap-1">
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">
                    Очистить
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-7 w-7 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  Нет уведомлений
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 flex gap-3 items-start transition-colors ${
                        !n.read ? "bg-primary/5" : ""
                      } ${n.important ? "border-l-2 border-l-warning" : ""}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatTime(n.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};
