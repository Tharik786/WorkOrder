import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://zanconfigpage.zancompute.com:444/api' : '/api')
});

const emptyForm = {
  title: '',
  description: '',
  clientName: '',
  buildingName: '',
  floorName: '',
  areaName: '',
  deviceName: '',
  deviceType: '',
  deviceMacId: '',
  priority: 'MEDIUM',
  status: 'OPEN',
  assignedTo: '',
  createdBy: '',
  lastReportedTime: ''
};

function toInputDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDisplayDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function App() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [o, s] = await Promise.all([
        api.get('/work-orders'),
        api.get('/dashboard')
      ]);
      setOrders(Array.isArray(o.data) ? o.data : []);
      setStats(s.data || {});
    } catch (err) {
      console.error('Error fetching data:', err);
      showNotification('Failed to fetch work orders: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotification('Title is required', 'error');
      return;
    }

    try {
      const payload = {
        ...form,
        lastReportedTime: form.lastReportedTime ? form.lastReportedTime : null
      };

      if (editing) {
        await api.put(`/work-orders/${editing}`, payload);
        showNotification(`Work Order #${editing} updated successfully`);
      } else {
        const res = await api.post('/work-orders', payload);
        showNotification(`Work Order #${res.data?.id || ''} created successfully`);
      }

      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      console.error('Save error:', err);
      showNotification('Error saving work order: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleEdit = (o) => {
    setEditing(o.id);
    setForm({
      title: o.title || '',
      description: o.description || '',
      clientName: o.clientName || '',
      buildingName: o.buildingName || '',
      floorName: o.floorName || '',
      areaName: o.areaName || '',
      deviceName: o.deviceName || '',
      deviceType: o.deviceType || '',
      deviceMacId: o.deviceMacId || '',
      priority: o.priority || 'MEDIUM',
      status: o.status || 'OPEN',
      assignedTo: o.assignedTo || '',
      createdBy: o.createdBy || '',
      lastReportedTime: toInputDateTime(o.lastReportedTime)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };


  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !searchTerm ||
        [
          o.title,
          o.description,
          o.clientName,
          o.buildingName,
          o.floorName,
          o.areaName,
          o.deviceName,
          o.deviceType,
          o.deviceMacId,
          o.assignedTo,
          o.createdBy,
          String(o.id)
        ]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || o.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="app">
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <span>{notification.msg}</span>
          <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      <header className="main-header">
        <div className="brand-group">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1>Zan Compute</h1>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {/* KPI Summary Cards */}
        <section className="cards-grid">
          {[
            { label: 'Total Orders', count: stats.total, color: 'blue' },
            { label: 'Open', count: stats.open, color: 'orange' },
            { label: 'Assigned', count: stats.assigned, color: 'indigo' },
            { label: 'In Progress', count: stats.inProgress, color: 'amber' },
            { label: 'Pending', count: stats.pending, color: 'purple' },
            { label: 'Completed', count: stats.completed, color: 'emerald' }
          ].map((item) => (
            <div className={`stat-card stat-${item.color}`} key={item.label}>
              <div className="stat-label">{item.label}</div>
              <div className="stat-value">{item.count ?? 0}</div>
            </div>
          ))}
        </section>

        {/* Split Screen Layout: Left = Create/Edit Form, Right = Work Order Cards */}
        <div className="layout-split">
          {/* Left Side: Create / Edit Work Order Form */}
          <section className="panel form-panel">
            <div className="panel-header">
              <div className="panel-header-left">
                <h2>{editing ? `Edit Order #${editing}` : 'Create Work Order'}</h2>
                {editing && <span className="editing-badge">Editing Mode</span>}
              </div>
              <div className="panel-header-actions">
                <button
                  type="button"
                  className="btn-clear"
                  onClick={() => { setForm(emptyForm); if (editing) handleCancelEdit(); }}
                  title="Clear all fields"
                >
                  Clear
                </button>
                {editing && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={save} className="workorder-form-container">
              <div className="workorder-form-scrollable">
                {/* General Information */}
                <div className="compact-section-divider">
                  <span>General Information</span>
                </div>
                <div className="form-group full-col">
                  <label>Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="form-group full-col">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Location Details */}
                <div className="compact-section-divider">
                  <span>Location Details</span>
                </div>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Client Name</label>
                    <input
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Building Name</label>
                    <input
                      value={form.buildingName}
                      onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Floor Name</label>
                    <input
                      value={form.floorName}
                      onChange={(e) => setForm({ ...form, floorName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Area Name</label>
                    <input
                      value={form.areaName}
                      onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Device & Assignment */}
                <div className="compact-section-divider">
                  <span>Device & Assignment</span>
                </div>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Device Name</label>
                    <input
                      value={form.deviceName}
                      onChange={(e) => setForm({ ...form, deviceName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Device Type</label>
                    <input
                      value={form.deviceType}
                      onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Device MAC ID</label>
                    <input
                      value={form.deviceMacId}
                      onChange={(e) => setForm({ ...form, deviceMacId: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assigned To</label>
                    <input
                      value={form.assignedTo}
                      onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    />
                  </div>
                </div>

                {/* Status & Workflow */}
                <div className="compact-section-divider">
                  <span>Workflow & Status</span>
                </div>
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING', 'COMPLETED', 'CANCELLED'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Created By</label>
                    <input
                      value={form.createdBy}
                      onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Reported Time</label>
                    <input
                      type="datetime-local"
                      value={form.lastReportedTime}
                      onChange={(e) => setForm({ ...form, lastReportedTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-action-footer">
                <button type="submit" className="btn btn-primary btn-submit-order">
                  {editing ? 'Update Work Order' : 'Create Work Order'}
                </button>
              </div>
            </form>
          </section>

          {/* Right Side: Work Orders List Panel (Card Wise) */}
          <section className="panel list-panel">
            <div className="panel-header table-panel-header">
              <div className="panel-title-group">
                <h2>Work Orders</h2>
                <span className="count-tag">{filteredOrders.length} records</span>
              </div>
              <div className="filter-controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search orders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Statuses</option>
                  {['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING', 'COMPLETED', 'CANCELLED'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Priorities</option>
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="wo-cards-grid">
              {filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className={`wo-record-card ${selectedOrder?.id === o.id ? 'card-selected' : ''}`}
                >
                  {/* Card Top: Badges and Quick Actions */}
                  <div className="wo-record-header">
                    <div className="wo-record-badges">
                      <span className="wo-id-badge">#{o.id}</span>
                      <span className={`pill status-${(o.status || 'open').toLowerCase()}`}>
                        {o.status || 'OPEN'}
                      </span>
                    </div>
                    <div className="wo-record-actions">
                      <button
                        className="btn-card-action btn-card-view"
                        onClick={() => setSelectedOrder(o)}
                        title="View Details"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>View</span>
                      </button>
                      <button
                        className="btn-card-action btn-card-edit"
                        onClick={() => handleEdit(o)}
                        title="Edit Work Order"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Title */}
                  <div className="wo-record-body" onClick={() => setSelectedOrder(o)}>
                    <h3 className="wo-record-title">{o.title}</h3>
                  </div>

                  {/* Clean Core Information (No Emojis, No Timestamps) */}
                  <div className="wo-card-info-list">
                    <div className="wo-info-item">
                      <span className="wo-info-label">Location:</span>
                      <span className="wo-info-value">
                        <strong>{o.clientName || 'General Location'}</strong>
                        {[o.buildingName, o.floorName, o.areaName].filter(Boolean).length > 0 && (
                          <span className="wo-info-sub">
                            {' '}({[o.buildingName, o.floorName, o.areaName].filter(Boolean).join(' • ')})
                          </span>
                        )}
                      </span>
                    </div>

                    {o.deviceType && (
                      <div className="wo-info-item">
                        <span className="wo-info-label">Device:</span>
                        <span className="wo-info-value">
                          <strong>{o.deviceType}</strong>
                        </span>
                      </div>
                    )}

                    <div className="wo-info-item">
                      <span className="wo-info-label">Assigned:</span>
                      <span className="wo-info-value">
                        <strong>{o.assignedTo || 'Unassigned'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && filteredOrders.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No work orders found</h3>
                  <p>
                    {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                      ? 'No work orders match the current filter criteria.'
                      : 'Create your first work order using the form on the left.'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-id">Work Order #{selectedOrder.id}</span>
                <h3>{selectedOrder.title}</h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              {/* Description */}
              <div className="modal-section full-width">
                <h4>Description</h4>
                <p className="modal-desc-text">{selectedOrder.description || 'No description provided.'}</p>
              </div>

              {/* Grid of Details */}
              <div className="modal-grid">
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`pill status-${(selectedOrder.status || 'open').toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority</span>
                  <span className={`pill priority-${(selectedOrder.priority || 'medium').toLowerCase()}`}>
                    {selectedOrder.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Client Name</span>
                  <span className="detail-value">{selectedOrder.clientName || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Building Name</span>
                  <span className="detail-value">{selectedOrder.buildingName || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Floor Name</span>
                  <span className="detail-value">{selectedOrder.floorName || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Area Name</span>
                  <span className="detail-value">{selectedOrder.areaName || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Device Name</span>
                  <span className="detail-value">{selectedOrder.deviceName || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Device Type</span>
                  <span className="detail-value">{selectedOrder.deviceType || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Device MAC ID</span>
                  <span className="detail-value mac-code">{selectedOrder.deviceMacId || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned Technician</span>
                  <span className="detail-value">{selectedOrder.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created By</span>
                  <span className="detail-value">{selectedOrder.createdBy || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created Time</span>
                  <span className="detail-value">{formatDisplayDate(selectedOrder.createdTime || selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Reported Time</span>
                  <span className="detail-value">{formatDisplayDate(selectedOrder.lastReportedTime)}</span>
                </div>
                {selectedOrder.completedAt && (
                  <div className="detail-item">
                    <span className="detail-label">Completed Time</span>
                    <span className="detail-value">{formatDisplayDate(selectedOrder.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleEdit(selectedOrder);
                  setSelectedOrder(null);
                }}
              >
                Edit Order
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
