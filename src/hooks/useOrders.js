import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function dbToOrder(row) {
  return {
    id: row.id,
    customer: row.customer,
    email: row.email,
    phone: row.phone,
    itemCount: row.item_count,
    total: Number(row.total),
    date: row.date,
    status: row.status,
    items: row.items || [],
  };
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data.map(dbToOrder));
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const createOrder = useCallback(async (order) => {
    const payload = {
      id: order.id,
      customer: order.customer,
      email: order.email,
      phone: order.phone || '',
      item_count: order.itemCount,
      total: order.total,
      date: order.date,
      status: order.status,
      items: order.items || [],
    };
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();
    if (!error && data) {
      const newOrder = dbToOrder(data);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    }
    return null;
  }, []);

  return { orders, loading, createOrder };
}
