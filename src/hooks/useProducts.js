import { useState, useEffect, useCallback } from 'react';
import { supabase, productImageUrl } from '../lib/supabase';

function dbToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    stock: row.stock,
    description: row.description,
    features: row.features || [],
    active: row.active,
    image: productImageUrl(row.image_url),
    image_url: row.image_url,
  };
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setProducts(data.map(dbToProduct));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const updated = dbToProduct(payload.new);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
        const inserted = dbToProduct(payload.new);
        setProducts(prev => [...prev.filter(p => p.id !== inserted.id), inserted]
          .sort((a, b) => a.id - b.id));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'products' }, (payload) => {
        setProducts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProducts]);

  const saveProduct = useCallback(async (product, imageFile) => {
    let image_url = product.image_url || '';

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, imageFile, { upsert: true });
      if (!uploadError) image_url = path;
    }

    const payload = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      features: product.features,
      active: product.active,
      image_url,
    };

    if (product.id && typeof product.id === 'number' && product.id > 0 && !product._isNew) {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select()
        .single();
      if (!error && data) {
        setProducts(prev => prev.map(p => p.id === data.id ? dbToProduct(data) : p));
        return dbToProduct(data);
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();
      if (!error && data) {
        setProducts(prev => [...prev, dbToProduct(data)]);
        return dbToProduct(data);
      }
    }
    return null;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return { products, loading, saveProduct, deleteProduct };
}
