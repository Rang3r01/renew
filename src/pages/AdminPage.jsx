import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';

export function AdminPage({ products, orders, onSaveProduct, onDeleteProduct, onNavigate }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', background:'#F5F8FA' }}>
      <nav style={{ background:'#0d2b35', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52 }}>
        <span style={{ color:'#fff', fontWeight:700 }}>Admin Dashboard</span>
        <button onClick={()=>onNavigate('store')} style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, color:'rgba(255,255,255,0.5)', fontSize:11, padding:'6px 10px', cursor:'pointer' }}>← Store</button>
      </nav>
      <div style={{ padding:'32px' }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#1a2b30', marginBottom:28 }}>Dashboard</h1>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:32 }}>
          {[
            { label:'Revenue', value:`R ${(orders.reduce((s,o)=>s+o.total,0)/1000).toFixed(1)}k` },
            { label:'Orders', value:orders.length },
            { label:'Products', value:products.length },
            { label:'Low Stock', value:products.filter(p=>p.stock<=5).length },
          ].map((s,i)=>(
            <div key={i} style={{ background:'#fff', borderRadius:12, padding:'24px', border:'1px solid #E8EEF0' }}>
              <div style={{ fontSize:26, fontWeight:800, color:'#1a2b30' }}>{s.value}</div>
              <div style={{ fontSize:13, color:'#9AABB0', marginTop:8 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#1a2b30', marginBottom:16 }}>Recent Orders</h2>
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8EEF0', overflow:'hidden' }}>
          {orders.slice(0,5).map(o=>(
            <div key={o.id} style={{ padding:'16px', borderBottom:'1px solid #F0F4F7', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, color:'#2BB5C8', fontSize:12, marginBottom:4 }}>{o.id}</div>
                <div style={{ fontWeight:600, color:'#1a2b30' }}>{o.customer}</div>
              </div>
              <div style={{ fontWeight:800, color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
