import { useState, useEffect } from 'react';
import { Home, Clock, RefreshCw, ShoppingCart } from 'lucide-react';
import { supabase, Item, Log, ShoppingItem } from './lib/supabase';
import ItemsList from './components/ItemsList';
import ActivityLog from './components/ActivityLog';
import ShoppingList from './components/ShoppingList';

type Tab = 'items' | 'logs' | 'shopping';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
    fetchLogs();
    fetchShoppingItems();

    const itemsSubscription = supabase
      .channel('items-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
        fetchItems();
      })
      .subscribe();

    const logsSubscription = supabase
      .channel('logs-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    const shoppingSubscription = supabase
      .channel('shopping-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list' }, () => {
        fetchShoppingItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(itemsSubscription);
      supabase.removeChannel(logsSubscription);
      supabase.removeChannel(shoppingSubscription);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      console.log('Items fetched:', data);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching logs:', error);
        throw error;
      }
      console.log('Logs fetched:', data);
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchShoppingItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .select('*')
        .order('is_completed', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shopping items:', error);
        throw error;
      }
      console.log('Shopping items fetched:', data);
      setShoppingItems(data || []);
    } catch (error) {
      console.error('Error fetching shopping items:', error);
    }
  };

  const addLog = async (itemId: string | null, itemName: string, action: string, quantityChange: number, comment: string) => {
    try {
      const { error } = await supabase
        .from('logs')
        .insert([{
          item_id: itemId,
          item_name: itemName,
          action,
          quantity_change: quantityChange,
          comment
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleAddItem = async (name: string, quantity: number, category: string, comment: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ name, quantity, category }])
        .select()
        .single();

      if (error) throw error;

      await addLog(data.id, name, 'add', quantity, comment);
      await fetchItems();
      await fetchLogs();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateQuantity = async (item: Item, change: number, comment: string) => {
    try {
      const newQuantity = Math.max(0, item.quantity + change);

      const { error } = await supabase
        .from('items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;

      const action = change > 0 ? 'update' : 'remove';
      await addLog(item.id, item.name, action, change, comment);
      await fetchItems();
      await fetchLogs();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteItem = async (item: Item, comment: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await addLog(null, item.name, 'delete', 0, comment);
      await fetchItems();
      await fetchLogs();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddShoppingItem = async (itemName: string, quantity: number, memo: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list')
        .insert([{ item_name: itemName, quantity, memo }]);

      if (error) throw error;
      await fetchShoppingItems();
    } catch (error) {
      console.error('Error adding shopping item:', error);
    }
  };

  const handleToggleShoppingComplete = async (item: ShoppingItem) => {
    try {
      const newCompletedStatus = !item.is_completed;
      const { error } = await supabase
        .from('shopping_list')
        .update({
          is_completed: newCompletedStatus,
          completed_at: newCompletedStatus ? new Date().toISOString() : null
        })
        .eq('id', item.id);

      if (error) throw error;
      await fetchShoppingItems();
    } catch (error) {
      console.error('Error toggling shopping item:', error);
    }
  };

  const handleDeleteShoppingItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchShoppingItems();
    } catch (error) {
      console.error('Error deleting shopping item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Home Stock Share</h1>
            <p className="text-gray-600">家族で共有する備品管理アプリ</p>
          </div>
          <button
            onClick={() => {
              fetchItems();
              fetchLogs();
              fetchShoppingItems();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
            更新
          </button>
        </header>

        <div className="mb-6 bg-white rounded-lg shadow-md p-1 inline-flex">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'items'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            備品リスト
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'logs'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={20} />
            操作ログ
            {logs.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {logs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'shopping'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart size={20} />
            買い物リスト
            {shoppingItems.filter(item => !item.is_completed).length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {shoppingItems.filter(item => !item.is_completed).length}
              </span>
            )}
          </button>
        </div>

        <main>
          {activeTab === 'items' ? (
            <ItemsList
              items={items}
              onAddItem={handleAddItem}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={handleDeleteItem}
            />
          ) : activeTab === 'logs' ? (
            <ActivityLog logs={logs} />
          ) : (
            <ShoppingList
              items={shoppingItems}
              onAddItem={handleAddShoppingItem}
              onToggleComplete={handleToggleShoppingComplete}
              onDeleteItem={handleDeleteShoppingItem}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
