import { useState } from 'react';
import { ShoppingCart, Plus, Check, Trash2, X } from 'lucide-react';
import { ShoppingItem } from '../lib/supabase';

interface ShoppingListProps {
  items: ShoppingItem[];
  onAddItem: (itemName: string, quantity: number, memo: string) => Promise<void>;
  onToggleComplete: (item: ShoppingItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function ShoppingList({ items, onAddItem, onToggleComplete, onDeleteItem }: ShoppingListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', quantity: 1, memo: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName.trim()) return;

    await onAddItem(newItem.itemName, newItem.quantity, newItem.memo);
    setNewItem({ itemName: '', quantity: 1, memo: '' });
    setIsAdding(false);
  };

  const pendingItems = items.filter(item => !item.is_completed);
  const completedItems = items.filter(item => item.is_completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-gray-700" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">買い物リスト</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          追加
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">買うもの</label>
            <input
              type="text"
              value={newItem.itemName}
              onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: トイレットペーパー"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
            <input
              type="text"
              value={newItem.memo}
              onChange={(e) => setNewItem({ ...newItem, memo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 特売の物を買う"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewItem({ itemName: '', quantity: 1, memo: '' });
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {pendingItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">買う予定（{pendingItems.length}件）</h3>
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 border-orange-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-800 text-lg">{item.item_name}</h4>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          × {item.quantity}
                        </span>
                      </div>
                      {item.memo && (
                        <p className="text-sm text-gray-600 mt-1">📝 {item.memo}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        追加: {new Date(item.created_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => onToggleComplete(item)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="購入済みにする"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">購入済み（{completedItems.length}件）</h3>
            <div className="space-y-2">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 border-green-400 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-600 text-lg line-through">{item.item_name}</h4>
                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                          × {item.quantity}
                        </span>
                      </div>
                      {item.memo && (
                        <p className="text-sm text-gray-500 mt-1 line-through">📝 {item.memo}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        購入: {item.completed_at ? new Date(item.completed_at).toLocaleString('ja-JP') : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => onToggleComplete(item)}
                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                        title="未購入に戻す"
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
            <p>買い物リストが空です</p>
            <p className="text-sm">「追加」ボタンから買う物を登録してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
