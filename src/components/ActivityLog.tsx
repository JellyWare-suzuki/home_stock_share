import { MessageSquare, Plus, Minus, Trash2, Edit } from 'lucide-react';
import { Log } from '../lib/supabase';

interface ActivityLogProps {
  logs: Log[];
}

export default function ActivityLog({ logs }: ActivityLogProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add':
        return <Plus size={16} className="text-blue-500" />;
      case 'remove':
        return <Minus size={16} className="text-orange-500" />;
      case 'update':
        return <Edit size={16} className="text-green-500" />;
      case 'delete':
        return <Trash2 size={16} className="text-red-500" />;
      default:
        return <MessageSquare size={16} className="text-gray-500" />;
    }
  };

  const getActionText = (log: Log) => {
    switch (log.action) {
      case 'add':
        return `「${log.item_name}」を追加しました`;
      case 'remove':
        return `「${log.item_name}」を${Math.abs(log.quantity_change)}個使用しました`;
      case 'update':
        if (log.quantity_change > 0) {
          return `「${log.item_name}」を${log.quantity_change}個追加しました`;
        } else {
          return `「${log.item_name}」を${Math.abs(log.quantity_change)}個減らしました`;
        }
      case 'delete':
        return `「${log.item_name}」を削除しました`;
      default:
        return '操作を実行しました';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'add':
        return 'bg-blue-50 border-blue-200';
      case 'remove':
        return 'bg-orange-50 border-orange-200';
      case 'update':
        return 'bg-green-50 border-green-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const groupLogsByDate = (logs: Log[]) => {
    const groups: { [key: string]: Log[] } = {};

    logs.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });

    return groups;
  };

  const logGroups = groupLogsByDate(logs);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-gray-700" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">操作ログ</h2>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
          <p>まだ操作履歴がありません</p>
          <p className="text-sm">備品を追加・更新すると履歴が表示されます</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(logGroups).map(([date, dateLogs]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-sm font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                  {date}
                </span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="space-y-2">
                {dateLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getActionColor(log.action)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {getActionText(log)}
                        </p>
                        {log.comment && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            💬 {log.comment}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(log.created_at).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
