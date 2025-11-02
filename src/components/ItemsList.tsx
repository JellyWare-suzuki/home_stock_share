import { useState } from 'react';
import { Plus, Minus, Trash2, Package } from 'lucide-react';
import { Item } from '../lib/supabase';

interface ItemsListProps {
  items: Item[];
  onAddItem: (name: string, quantity: number, category: string, comment: string) => Promise<void>;
  onUpdateQuantity: (item: Item, change: number, comment: string) => Promise<void>;
  onDeleteItem: (item: Item, comment: string) => Promise<void>;
}

export default function ItemsList({ items, onAddItem, onUpdateQuantity, onDeleteItem }: ItemsListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, category: '', comment: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionComment, setActionComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    await onAddItem(newItem.name, newItem.quantity, newItem.category, newItem.comment);
    setNewItem({ name: '', quantity: 1, category: '', comment: '' });
    setIsAdding(false);
  };

  const handleQuantityChange = async (item: Item, change: number) => {
    const comment = actionComment.trim() || (change > 0 ? '在庫を追加' : '在庫を使用');
    await onUpdateQuantity(item, change, comment);
    setActionComment('');
    setEditingId(null);
  };

  const handleDelete = async (item: Item) => {
    const comment = actionComment.trim() || '備品を削除';
    if (confirm(`「${item.name}」を削除しますか？`)) {
      await onDeleteItem(item, comment);
      setActionComment('');
      setEditingId(null);
    }
  };

  const categories = ['日用品', 'キッチン', 'トイレ', 'お風呂', 'その他'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">備品リスト</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          新規追加
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">備品名</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: トイレットペーパー"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">未分類</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">コメント（任意）</label>
            <input
              type="text"
              value={newItem.comment}
              onChange={(e) => setNewItem({ ...newItem, comment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: セールで購入"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewItem({ name: '', quantity: 1, category: '', comment: '' });
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  {item.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setActionComment('');
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="text-3xl font-bold text-center text-gray-800 my-4">
              {item.quantity}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleQuantityChange(item, -1)}
                disabled={item.quantity === 0}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={18} />
                使用
              </button>
              <button
                onClick={() => handleQuantityChange(item, 1)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus size={18} />
                追加
              </button>
            </div>

            {editingId === item.id && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder="コメントを入力..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 text-center mt-3">
              更新: {new Date(item.updated_at).toLocaleString('ja-JP')}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-3 opacity-50" />
          <p>備品がありません</p>
          <p className="text-sm">「新規追加」ボタンから備品を追加してください</p>
        </div>
      )}
    </div>
  );
}
