import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import './style.css';

const api=axios.create({baseURL:'/api'});

function App(){
 const [orders,setOrders]=useState([]); const [stats,setStats]=useState({});
 const [editing,setEditing]=useState(null);
 const [form,setForm]=useState({title:'',description:'',clientName:'',buildingName:'',deviceMacId:'',priority:'MEDIUM',status:'OPEN',assignedTo:''});
 const load=async()=>{const [o,s]=await Promise.all([api.get('/work-orders'),api.get('/dashboard')]);setOrders(o.data);setStats(s.data)};
 useEffect(()=>{load()},[]);
 const save=async e=>{e.preventDefault(); editing?await api.put('/work-orders/'+editing,form):await api.post('/work-orders',form);setEditing(null);setForm({title:'',description:'',clientName:'',buildingName:'',deviceMacId:'',priority:'MEDIUM',status:'OPEN',assignedTo:''});load()};
 const edit=o=>{setEditing(o.id);setForm({...o})};
 const remove=async id=>{if(confirm('Delete this work order?')){await api.delete('/work-orders/'+id);load()}};
 return <div className="app">
  <header><div><h1>Zan Compute</h1><p>Work Order Management System</p></div><span className="badge">DEVOPS LAB</span></header>
  <main>
   <section className="cards">{[['Total',stats.total],['Open',stats.open],['Assigned',stats.assigned],['In Progress',stats.inProgress],['Completed',stats.completed]].map(x=><div className="card" key={x[0]}><small>{x[0]}</small><strong>{x[1]??0}</strong></div>)}</section>
   <div className="grid">
    <section className="panel"><h2>{editing?'Edit Work Order':'Create Work Order'}</h2><form onSubmit={save}>
      <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      <div className="row"><input placeholder="Client" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})}/><input placeholder="Building" value={form.buildingName} onChange={e=>setForm({...form,buildingName:e.target.value})}/></div>
      <input placeholder="Device MAC ID" value={form.deviceMacId} onChange={e=>setForm({...form,deviceMacId:e.target.value})}/>
      <div className="row"><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{['LOW','MEDIUM','HIGH','CRITICAL'].map(x=><option key={x}>{x}</option>)}</select><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['OPEN','ASSIGNED','IN_PROGRESS','PENDING','COMPLETED','CANCELLED'].map(x=><option key={x}>{x}</option>)}</select></div>
      <input placeholder="Assigned technician" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}/>
      <button>{editing?'Update':'Create'} Work Order</button>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm({title:'',description:'',clientName:'',buildingName:'',deviceMacId:'',priority:'MEDIUM',status:'OPEN',assignedTo:''})}}>Cancel</button>}
    </form></section>
    <section className="panel"><div className="tableHead"><h2>Work Orders</h2><button className="secondary" onClick={load}>Refresh</button></div><div className="tableWrap"><table><thead><tr><th>ID</th><th>Title</th><th>Device</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Actions</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}</td><td><b>{o.title}</b><div className="muted">{o.clientName||'—'}</div></td><td>{o.deviceMacId||'—'}</td><td><span className={'pill '+o.priority.toLowerCase()}>{o.priority}</span></td><td><span className="pill status">{o.status}</span></td><td>{o.assignedTo||'—'}</td><td><button className="mini" onClick={()=>edit(o)}>Edit</button><button className="mini danger" onClick={()=>remove(o.id)}>Delete</button></td></tr>)}</tbody></table>{!orders.length&&<p className="empty">No work orders yet.</p>}</div></section>
   </div>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
