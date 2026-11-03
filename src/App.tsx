import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
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
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem("dashboard-theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [workspace, setWorkspace] = useState<Workspace>("Admin workspace");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const isClient = workspace === "Client workspace";
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
            <div className="profile-avatar">SA</div>
            <div className="profile-copy"><strong>Shashwat Aneja</strong><small>{isClient ? "Client member" : "Workspace owner"}</small></div>
            <button className="icon-button profile-more" aria-label="Profile options"><MoreHorizontal size={18} /></button>
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

          <section className="metric-grid" aria-label="Workspace metrics">
            <article className="metric-card metric-featured">
              <div className="metric-top"><span>PROJECT VALUE</span><span className="metric-icon"><BriefcaseBusiness size={17} /></span></div>
              <div className="metric-value">₹4,82,500</div>
              <div className="metric-foot"><span className="trend trend-up"><ArrowUpRight size={13} /> 12.8%</span><span>vs. previous month</span></div>
              <div className="metric-decoration" />
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>ACTIVE PROJECTS</span><span className="metric-icon olive-icon"><FolderKanban size={17} /></span></div>
              <div className="metric-value">08</div>
              <div className="metric-foot"><span className="metric-note">03 due this month</span></div>
              <div className="metric-mini-bars"><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>AWAITING APPROVAL</span><span className="metric-icon sand-icon"><ShieldCheck size={17} /></span></div>
              <div className="metric-value">04</div>
              <div className="metric-foot"><span className="metric-note">Needs your attention</span></div>
              <div className="metric-approval"><span /><span /><span /><span /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>UNREAD MESSAGES</span><span className="metric-icon rose-icon"><MessageCircle size={17} /></span></div>
              <div className="metric-value">03</div>
              <div className="metric-foot"><span className="metric-note">Across 2 conversations</span></div>
              <div className="metric-message"><span /><span /><span /></div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">FINANCIAL OVERVIEW</span><h2>Revenue overview</h2><p>A steady view of your studio's momentum.</p></div>
                <button className="icon-button" aria-label="More revenue options"><MoreHorizontal size={19} /></button>
              </div>
              <div className="chart-summary"><strong>₹2,84,000</strong><span className="trend trend-up"><ArrowUpRight size={13} /> 18.4%</span><small>Collected this period</small></div>
              <div className="chart-wrap">
                <div className="chart-y-labels"><span>₹1.0L</span><span>₹75k</span><span>₹50k</span><span>₹25k</span><span>₹0</span></div>
                <div className="bar-chart" role="img" aria-label="Illustrative monthly revenue chart from January to December">
                  <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
                  {revenue.map((height, index) => <div className="bar-column" key={index}><span className={index === 11 ? "bar bar-highlight" : "bar"} style={{ height: `${height}%` }} /></div>)}
                </div>
              </div>
              <div className="chart-months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span></div>
            </article>

            <article className="panel attention-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">YOUR ATTENTION</span><h2>Things to follow up</h2><p>A few things need a closer look.</p></div>
                <span className="attention-count">04</span>
              </div>
              <div className="attention-list">
                <button className="attention-item" onClick={() => setActivePage("Approvals")}><span className="attention-symbol approval-symbol"><ShieldCheck size={16} /></span><span className="attention-copy"><strong>Design approval pending</strong><small>Northstar Commerce · 2 days ago</small></span><ArrowRight size={15} /></button>
                <button className="attention-item" onClick={() => setActivePage("Finance")}><span className="attention-symbol payment-symbol"><CreditCard size={16} /></span><span className="attention-copy"><strong>Invoice payment due</strong><small>Meridian Platform · ₹24,000</small></span><ArrowRight size={15} /></button>
                <button className="attention-item" onClick={() => setActivePage("Tasks & operations")}><span className="attention-symbol task-symbol"><CalendarDays size={16} /></span><span className="attention-copy"><strong>Milestone approaching</strong><small>Forma Identity · Nov 06</small></span><ArrowRight size={15} /></button>
                <button className="attention-item" onClick={() => setActivePage("Communication")}><span className="attention-symbol message-symbol"><MessageCircle size={16} /></span><span className="attention-copy"><strong>3 unread messages</strong><small>Across 2 client conversations</small></span><ArrowRight size={15} /></button>
              </div>
              <button className="text-link" onClick={() => setActivePage("Activity")}>View all activity <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel projects-panel">
              <div className="panel-heading project-heading">
                <div><span className="section-kicker">IN MOTION</span><h2>Active projects <span className="heading-count">08</span></h2><p>Keep track of what's being built.</p></div>
                <button className="text-link" onClick={() => setActivePage("Projects")}>All projects <ArrowRight size={14} /></button>
              </div>
              <div className="project-table">
                <div className="project-table-head"><span>PROJECT</span><span>PROGRESS</span><span>STATUS</span><span>DUE DATE</span><span /></div>
                {projects.map((project) => (
                  <div className="project-row" key={project.name}>
                    <div className="project-name-cell"><span className={`project-symbol ${project.color}`}>{project.name.slice(0, 1)}</span><span><strong>{project.name}</strong><small>{project.client}</small></span></div>
                    <div className="progress-cell"><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><small>{project.progress}%</small></div>
                    <div><span className={project.status === "In review" ? "status-pill status-review" : "status-pill"}><i />{project.status}</span></div>
                    <span className="due-date">{project.due}</span>
                    <button className="icon-button row-more" aria-label={`More options for ${project.name}`}><MoreHorizontal size={17} /></button>
                  </div>
                ))}
              </div>
              <button className="mobile-all-link" onClick={() => setActivePage("Projects")}>View all projects <ArrowRight size={14} /></button>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">THE LATEST</span><h2>Recent activity</h2><p>Small updates, all in one place.</p></div>
                <button className="icon-button" aria-label="More activity options"><MoreHorizontal size={19} /></button>
              </div>
              <div className="activity-list">
                {activityItems.map((item) => <div className="activity-item" key={item.title}><span className={`activity-avatar ${item.tone}`}>{item.initials}</span><div className="activity-copy"><strong>{item.title}</strong><small>{item.detail}</small><time>{item.time}</time></div></div>)}
              </div>
              <button className="text-link activity-link" onClick={() => setActivePage("Activity")}>See all updates <ArrowRight size={14} /></button>
            </article>
          </section>

          <footer className="page-footer"><span>© 2026 Shashwat Aneja Studio</span><span><i /> All systems operational</span><a href="mailto:hello@shashwataneja.com">Need help? Get in touch <ArrowUpRight size={12} /></a></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
