import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import DiseaseView from './DiseaseView.jsx';
import Dashboard from './Dashboard.jsx';

export default function Layout() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState('guide'); // 'guide' | 'dashboard'

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 70));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="layout">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle sidebar"
          >
            ☰
          </button>
          <span className="app-logo">💊</span>
          <span className="app-title">中美治疗指南</span>
          <span className="app-subtitle">Pharma Clinical Guidelines</span>
          {/* View tabs */}
          <div className="view-tabs">
            <button
              className={`view-tab${view === 'guide' ? ' active' : ''}`}
              onClick={() => setView('guide')}
            >
              📋 指南
            </button>
            <button
              className={`view-tab${view === 'dashboard' ? ' active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              📊 市场总览
            </button>
          </div>
        </div>
        <div className="topbar-right">
          {view === 'guide' && (
            <div className="zoom-controls">
              <button onClick={handleZoomOut} title="Zoom out" disabled={zoom <= 70}>−</button>
              <button onClick={handleZoomReset} className="zoom-label">{zoom}%</button>
              <button onClick={handleZoomIn} title="Zoom in" disabled={zoom >= 150}>+</button>
            </div>
          )}
        </div>
      </header>

      <div className="layout-body">
        {view === 'guide' ? (
          <>
            {/* Sidebar */}
            {sidebarOpen && (
              <Sidebar
                selected={selected}
                onSelect={setSelected}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            {/* Main Content */}
            <div className="content-area">
              <DiseaseView selected={selected} zoom={zoom} />
            </div>
          </>
        ) : (
          <div className="content-area">
            <Dashboard />
          </div>
        )}
      </div>
    </div>
  );
}
