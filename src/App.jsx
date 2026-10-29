import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Toaster, toast } from 'sonner';
import { CalendarDays, ChartColumn, Clock, ExternalLink, List, Monitor, Moon, RefreshCw, Settings, Smartphone, Sun, Tablet, Users } from 'lucide-react';
import { useStore } from './lib/store.js';
import { CFG, DEMO } from './lib/config.js';
import { go, useMedia, useRoute } from './lib/hooks.js';
import { fmtTime } from './lib/time.js';
import { Group, Row, Segmented, Sheet, StatusLine, Tag } from './components/ui.jsx';
import { CheckIn } from './views/CheckIn.jsx';
import { Today } from './views/Today.jsx';
import { Hours } from './views/Hours.jsx';
import { Records } from './views/Records.jsx';
import { Schedule } from './views/Schedule.jsx';
import centificMark from './assets/centific-mark.png';

// Centific mark, drawn as a mask so it takes the theme's logo color (dark grey / white).
const Logo = ({ size = 28 }) => (
  <span className="logo" role="img" aria-label="Centific" style={{ '--logo-src': `url(${centificMark})`, width: size, height: size }} />
);

// Two separate experiences: the check-in page everyone uses (#/), and the admin
// views for leads (#/admin/...). Nothing on the check-in page links to admin.
const ADMIN_NAV = [
  { id: 'admin/today', label: 'Today', icon: Users, view: Today },
  { id: 'admin/schedule', label: 'Schedule', icon: CalendarDays, view: Schedule },
  { id: 'admin/hours', label: 'Hours', icon: ChartColumn, view: Hours },
  { id: 'admin/records', label: 'Records', icon: List, view: Records },
];
const CHECKIN = { id: 'checkin', label: 'Check in', icon: Clock, view: CheckIn };
const LEGACY = { today: 'admin/today', schedule: 'admin/schedule', hours: 'admin/hours', records: 'admin/records', admin: 'admin/today' };

export default function App() {
  const route = useRoute();
  const { sync, theme, data, syncing, error, loadedAt } = useStore();
  const [settings, setSettings] = useState(false);
  const systemDark = useMedia('(prefers-color-scheme: dark)');
  const phone = useMedia('(max-width: 767px)');
  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#131314' : '#f3f4f6');
  }, [theme, resolved]);

  // Load now, then refresh every minute while the page is visible.
  useEffect(() => {
    sync();
    const id = setInterval(() => { if (!document.hidden) sync(); }, 60000);
    const onVis = () => { if (!document.hidden) sync(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [sync]);

  // Older links (#/today, #/hours, #/records) and a bare #/admin land on the admin views.
  useEffect(() => {
    const to = LEGACY[route];
    if (to) location.replace(`${location.pathname}${location.search}#/${to}${location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?')) : ''}`);
  }, [route]);
  const isAdmin = route.startsWith('admin') || route in LEGACY;
  const item = isAdmin ? ADMIN_NAV.find((n) => n.id === (LEGACY[route] || route)) || ADMIN_NAV[0] : CHECKIN;

  // The page's large title folds into the phone top bar once it scrolls under it.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(false);
    let io;
    const id = requestAnimationFrame(() => {
      const t = document.querySelector('.main .large-title');
      if (!t) return;
      io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), { rootMargin: '-56px 0px 0px 0px' });
      io.observe(t);
    });
    return () => { cancelAnimationFrame(id); io?.disconnect(); };
  }, [item.id, data]);
  const View = item.view;
  const manualSync = async () => {
    try { await sync({ manual: true }); } catch (e) { toast.error("Couldn't refresh", { description: e.message }); }
  };
  const status = DEMO
    ? 'Demo data'
    : syncing && !data ? 'Loading…'
      : error ? 'Refresh failed'
        : loadedAt ? `Updated ${fmtTime(loadedAt)}` : '';

  const main = (
    <main className="main" key={item.id}>
      {data ? <View /> : <div className="view"><div className="skeleton" /><div className="skeleton tall" /></div>}
    </main>
  );
  const actions = (compact) => (
    <>
      <SyncButton syncing={syncing} onClick={manualSync} status={status} error={error} compact={compact} />
      <button type="button" className="icon-btn" aria-label="Settings" onClick={() => setSettings(true)}><Settings size={18} /></button>
    </>
  );
  const toaster = (
    <>
      <SettingsSheet open={settings} onOpenChange={setSettings} admin={isAdmin} />
      {/* On phones the check-in actions sit at the bottom, so toasts come in from the top. */}
      <Toaster position={phone ? 'top-center' : 'bottom-center'} duration={6000} theme={resolved} offset={24} mobileOffset={{ top: 64 }} toastOptions={{ className: 'toast' }} />
    </>
  );

  if (!isAdmin) {
    return (
      <div className="app app-checkin">
        <header className="topbar topbar-checkin">
          <div className="top-left">
            <Logo size={26} />
            <span className="top-brand">On-site Check-in</span>
            {DEMO && <Tag tone="warn">Demo</Tag>}
          </div>
          <div className="top-actions">{actions(true)}</div>
        </header>
        {main}
        {toaster}
      </div>
    );
  }

  return (
    <div className="app app-admin">
      <aside className="sidebar">
        <div className="side-brand">
          <Logo size={30} />
          <div className="side-titles">
            <span className="side-name">On-site Admin</span>
            <span className="side-project">{CFG.project}</span>
          </div>
        </div>
        <nav className="side-nav" aria-label="Admin">
          {ADMIN_NAV.map((n) => (
            <a key={n.id} href={`#/${n.id}`} className={clsx('side-link', n.id === item.id && 'is-active')} aria-current={n.id === item.id ? 'page' : undefined}>
              <n.icon size={18} aria-hidden="true" />
              {n.label}
            </a>
          ))}
        </nav>
        <a className="side-out" href="#/" target="_blank" rel="noopener">
          <ExternalLink size={15} aria-hidden="true" /> Open the check-in page
        </a>
        <div className="side-foot">{actions(false)}</div>
      </aside>

      <header className="topbar" data-collapsed={collapsed || undefined}>
        <div className="top-left">
          <Logo size={24} />
          {DEMO && <Tag tone="warn">Demo</Tag>}
          <span className="top-name">{item.label}</span>
        </div>
        <div className="top-actions">{actions(true)}</div>
      </header>

      {main}

      <nav className="tabbar" aria-label="Admin">
        {ADMIN_NAV.map((n) => (
          <a key={n.id} href={`#/${n.id}`} className={clsx('tab', n.id === item.id && 'is-active')} aria-current={n.id === item.id ? 'page' : undefined}>
            <n.icon size={22} aria-hidden="true" />
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
      {toaster}
    </div>
  );
}

function SyncButton({ syncing, onClick, status, error, compact }) {
  return (
    <button
      type="button"
      className={clsx('sync', syncing && 'is-busy', error && 'is-bad', compact && 'sync-compact')}
      onClick={onClick}
      aria-busy={syncing}
      title={error || 'Refresh now'}
    >
      <span className="sync-icon" aria-hidden="true">
        <RefreshCw size={16} className="sync-glyph" />
        <span className="dots"><i /><i /><i /><i /></span>
      </span>
      <span className={clsx('sync-text', compact && 'sr-only-sm')} role="status" aria-live="polite">
        <StatusLine text={syncing ? 'Syncing' : status} />
      </span>
    </button>
  );
}

function SettingsSheet({ open, onOpenChange, admin }) {
  const { theme, setTheme, device, setDevice, me, forgetMe, resetDemo } = useStore();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Settings">
      <Group title="Appearance">
        <div className="pad">
          <Segmented
            label="Appearance"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'system', label: 'System', icon: <Monitor size={15} /> },
              { value: 'light', label: 'Light', icon: <Sun size={15} /> },
              { value: 'dark', label: 'Dark', icon: <Moon size={15} /> },
            ]}
          />
        </div>
      </Group>
      {!admin && (
        <Group title="This device" footer={device === 'shared' ? 'Everyone picks their name each time. Nothing about a person is remembered here.' : 'Remembers one person, so checking in is one tap.'}>
          <div className="pad">
            <Segmented
              label="This device"
              value={device || 'personal'}
              onChange={(v) => { setDevice(v); if (v === 'shared') forgetMe(); }}
              options={[
                { value: 'personal', label: 'My phone', icon: <Smartphone size={15} /> },
                { value: 'shared', label: 'Shared tablet', icon: <Tablet size={15} /> },
              ]}
            />
          </div>
          {device !== 'shared' && me && (
            <Row title={me.name} subtitle={me.email} trailing={<button type="button" className="link" onClick={forgetMe}>Forget</button>} />
          )}
        </Group>
      )}
      <Group title="Data" footer={DEMO ? 'Sample data saved only in this browser. Add the Power Automate flow URLs to config.js to go live.' : 'Reads and writes the Excel workbook on SharePoint through Power Automate.'}>
        <Row title="Source" trailing={DEMO ? 'Demo' : 'Live · Excel'} />
        {DEMO && <Row title="Reset sample data" onClick={() => { resetDemo(); toast('Sample data reset'); }} className="row-action" />}
      </Group>
    </Sheet>
  );
}
