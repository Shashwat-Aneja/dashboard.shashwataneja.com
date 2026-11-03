import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthGate";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  Users,
  X,
} from "lucide-react";

type Theme = "light" | "dark";
type Workspace = "Admin workspace" | "Client workspace";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, section: "WORKSPACE" },
  { label: "Projects", icon: FolderKanban, count: "8" },
  { label: "Clients", icon: Users },
  { label: "Tasks & operations", icon: Check },
  { label: "Communication", icon: MessageCircle, count: "3" },
  { label: "Deliverables", icon: FileText },
  { label: "Finance", icon: CreditCard, section: "MANAGEMENT" },
  { label: "Activity", icon: Activity },
];

const projects = [
  { name: "Northstar Commerce", type: "E-commerce website", client: "Northstar Labs", progress: 78, status: "In progress", due: "Nov 12", color: "clay" },
  { name: "Forma Identity", type: "Brand identity & website", client: "Forma Studio", progress: 54, status: "In progress", due: "Nov 18", color: "olive" },
  { name: "Meridian Platform", type: "Web application", client: "Meridian Group", progress: 32, status: "In review", due: "Nov 24", color: "sand" },
];

const activityItems = [
  { initials: "NS", title: "New feedback received", detail: "Northstar Commerce · Homepage direction", time: "12 min ago", tone: "clay" },
  { initials: "FM", title: "Milestone approved", detail: "Forma Identity · Visual exploration", time: "1 hr ago", tone: "olive" },
  { initials: "AK", title: "Payment recorded", detail: "Meridian Platform · Invoice #MP-014", time: "3 hrs ago", tone: "sand" },
];

const revenue = [32, 45, 38, 58, 48, 68, 55, 74, 62, 82, 72, 94];

function App() {
  const { user, isAdmin, signOut } = useAuth();
  const displayName = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Account");
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem("dashboard-theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [workspace, setWorkspace] = useState<Workspace>(isAdmin ? "Admin workspace" : "Client workspace");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const isClient = !isAdmin || workspace === "Client workspace";
  const pageTitle = activePage === "Overview" ? (isClient ? "Your workspace." : "A clearer view of work.") : activePage;

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">s<span>.</span></div>
          <div className="brand-copy">
            <span className="brand-name">studio<span>.</span></span>
            <span className="brand-caption">BY SHASHWAT ANEJA</span>
          </div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={17} /></button>
        </div>

        {isAdmin ? (
          <div className="workspace-wrap">
          <button className="workspace-switcher" onClick={() => setWorkspaceOpen(!workspaceOpen)} aria-expanded={workspaceOpen}>
            <span className="workspace-avatar">{isClient ? "N" : "S"}</span>
            <span className="workspace-label"><strong>{workspace}</strong><small>{isClient ? "Northstar Labs" : "Studio operations"}</small></span>
            <ChevronDown size={15} className={workspaceOpen ? "rotate" : ""} />
          </button>
          {workspaceOpen && (
            <div className="workspace-menu">
              {(["Admin workspace", "Client workspace"] as Workspace[]).map((item) => (
                <button key={item} className={workspace === item ? "workspace-option selected" : "workspace-option"} onClick={() => { setWorkspace(item); setWorkspaceOpen(false); setActivePage("Overview"); }}>
                  <span className="option-check">{workspace === item && <Check size={13} />}</span>
                  <span><strong>{item}</strong><small>{item === "Admin workspace" ? "Manage studio operations" : "View your project workspace"}</small></span>
                </button>
              ))}
            </div>
          )}
          </div>
        ) : (
          <div className="workspace-wrap"><div className="workspace-switcher"><span className="workspace-avatar">C</span><span className="workspace-label"><strong>Client workspace</strong><small>Your Studio projects</small></span></div></div>
        )}

        <nav className="primary-nav" aria-label="Main navigation">
          <span className="nav-caption">WORKSPACE</span>
          {navigation.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const hiddenForClient = isClient && ["Clients", "Tasks & operations"].includes(item.label);
            if (hiddenForClient) return null;
            return (
              <button key={item.label} className={activePage === item.label ? "nav-item active" : "nav-item"} onClick={() => { setActivePage(item.label); setSidebarOpen(false); }}>
                <Icon size={17} strokeWidth={1.8} />
                <span>{isClient && item.label === "Projects" ? "My projects" : item.label}</span>
                {item.count && <small className="nav-count">{item.count}</small>}
              </button>
            );
          })}
          {!isClient && <span className="nav-caption nav-caption-spaced">MANAGEMENT</span>}
          {!isClient && navigation.slice(6).map((item) => {
            const Icon = item.icon;
            return <button key={item.label} className={activePage === item.label ? "nav-item active" : "nav-item"} onClick={() => { setActivePage(item.label); setSidebarOpen(false); }}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span></button>;
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Find answers or talk to our team.</p>
            <button onClick={() => setActivePage("Help & support")}>Visit help centre <ArrowUpRight size={13} /></button>
          </div>
          <button className="nav-item settings-link" onClick={() => setActivePage("Settings")}><Settings2 size={17} /><span>Settings</span></button>
          <div className="profile-row">
            <div className="profile-avatar">{initials || "U"}</div>
            <div className="profile-copy"><strong>{displayName}</strong><small>{isAdmin ? "Studio administrator" : "Client account"}</small></div>
            <button className="icon-button profile-more" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button>
            <div className="breadcrumb"><span>Workspace</span><ChevronRight size={13} /><strong>{activePage}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className={searchOpen ? "search-trigger search-active" : "search-trigger"} onClick={() => setSearchOpen(!searchOpen)}><Search size={16} /><span>Search anything</span><kbd><Command size={11} /> K</kbd></button>
            <button className="icon-button theme-toggle" aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={17} /><i /></button>
            <div className="topbar-divider" />
            <button className="topbar-profile"><span className="profile-avatar small">SA</span><ChevronDown size={14} /></button>
          </div>
        </header>

        {searchOpen && <div className="search-panel"><Search size={17} /><input autoFocus placeholder="Search projects, clients, files..." onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }} /><kbd>ESC</kbd><button className="icon-button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={16} /></button></div>}

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> TUESDAY, NOVEMBER 3, 2026</div>
              <h1>{pageTitle}</h1>
              <p>{isClient ? "Everything happening with your project, all in one place." : "Here's what's moving across your studio today."}</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary"><CalendarDays size={15} /> Last 30 days <ChevronDown size={14} /></button>
              <button className="button button-primary" onClick={() => setActivePage(isClient ? "New request" : "New project")}><Plus size={16} /> {isClient ? "New request" : "Create project"}</button>
            </div>
          </div>

          {isClient ? (
            <section className="client-empty-state">
              <span className="section-kicker">CLIENT WORKSPACE</span>
              <h2>Your workspace is ready.</h2>
              <p>Your Studio project updates and shared files will appear here as they are added to your account.</p>
            </section>
          ) : (
            <>{adminContent}</>
          )}

          <footer className="page-footer"><span>© 2026 Shashwat Aneja Studio</span><span><i /> All systems operational</span><a href="mailto:hello@shashwataneja.com">Need help? Get in touch <ArrowUpRight size={12} /></a></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
