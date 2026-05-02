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
    paymentStatus: row.payment_status ?? 'unpaid',
    payfastPaymentId: row.payfast_payment_id ?? '',
    items: row.items || [],
    deliveryAddress: row.delivery_address || null,
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

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const updated = dbToOrder(payload.new);
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const inserted = dbToOrder(payload.new);
        setOrders(prev => [inserted, ...prev.filter(o => o.id !== inserted.id)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  const createOrder = useCallback(async (order) => {
    const payload = {
      id: order.id,
      customer: order.customer,
      email: order.email,
      phone: order.phone || '',
      item_count: order.itemCount,
      total: order.total,
      payment_status: 'unpaid',
      date: order.date,
      delivery_address: order.deliveryAddress || {},
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

  return { orders, loading, createOrder, refreshOrders: fetchOrders };
}
