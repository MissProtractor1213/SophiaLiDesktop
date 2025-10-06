import React, { useMemo, useState, useEffect } from "react";
import {
  Folder,
  Mail,
  Globe,
  X,
  Minus,
  Square,
  Grid,
  List,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import useFullscreen from "../hooks/useFullscreen";

/**
 * Public files (so they render inside iframes/images):
 * public/images/TEAM-PHOTO.png
 * public/images/BUDGET-REPORT.png
 * public/images/avatar.png
 * public/sim/files/suspicious-email.html
 * public/sim/files/itinerary.html
 * public/sim/files/invoice.html
 * public/sim/files/history-bank.html
 * public/sim/files/company-policy.pdf
 */
const WALLPAPER = "bg-gradient-to-r from-[#7fd6a7] via-[#b0e2a1] to-[#f3e78c]";

/* Simple Windows logo */
function WindowsLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      <rect x="16" y="16" width="104" height="104" fill="currentColor" />
      <rect x="136" y="16" width="104" height="104" fill="currentColor" />
      <rect x="16" y="136" width="104" height="104" fill="currentColor" />
      <rect x="136" y="136" width="104" height="104" fill="currentColor" />
    </svg>
  );
}

function WindowFrame({ title, icon, onClose, onMinimize, onMaximize, children }) {
  return (
    <div className="fixed inset-6 sm:inset-8 md:inset-10 bg-white/95 rounded-3xl shadow-2xl border border-white/60 backdrop-blur-xl flex flex-col z-30 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/50 bg-white/70 backdrop-blur-lg flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-lg font-semibold text-gray-800">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="w-11 h-11 rounded-lg hover:bg-black/5 flex items-center justify-center text-gray-700"
            title="Minimize"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={onMaximize}
            className="w-11 h-11 rounded-lg hover:bg-black/5 flex items-center justify-center text-gray-700"
            title="Maximize"
          >
            <Square size={18} />
          </button>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function IFrameViewer({ src, title }) {
  if (!src) {
    return (
      <div className="h-full w-full grid place-items-center text-base sm:text-lg text-gray-700 p-6">
        No file path provided. Add <code>path</code> for in-tab preview.
      </div>
    );
  }
  return (
    <iframe
      title={title || "viewer"}
      src={src}
      className="w-full h-full"
      sandbox="allow-same-origin allow-scripts"
    />
  );
}

/** ---------- File Explorer ---------- */
function FileExplorer() {
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);

  const files = useMemo(
    () => [
      {
        name: "company-policy.pdf",
        type: "pdf",
        size: "220 KB",
        modified: "Yesterday 4:02 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/company-policy.html`,
      },
      {
        name: "onboarding_attendees.xslx",
        type: "html",
        size: "1.2 MB",
        modified: "Today 3:10 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/onboarding_attendees.html`,
      },
      {
        name: "orientation_notes.docx",
        type: "html",
        suspicious: false,
        size: "4.7 KB",
        modified: "Today 9:22 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/orientation_notes.html`,
      },
      {
        name: "salary_bands_confidential.pdf",
        type: "html",
        size: "3.0 KB",
        modified: "Today 1:04 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/salary_bands.html`,
      },
      {
        name: "employee_ids.zip",
        type: "html",
        size: "3.0 KB",
        modified: "Today 1:00 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/employee_id.html`,
      },
      {
        name: "holiday_party.xslx",
        type: "html",
        size: "3.0 KB",
        modified: "Today 2:00 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/holiday_party.html`,
      },
    ],
    []
  );

  const iconFor = (type) => {
    if (type === "image") return <ImageIcon size={22} className="text-pink-500" />;
    if (type === "pdf") return <FileText size={22} className="text-red-500" />;
    if (type === "sheet") return <FileSpreadsheet size={22} className="text-green-600" />;
    return <FileText size={22} className="text-blue-600" />;
  };

  const renderPreview = (file) => {
    const { type, path, name } = file;
    if (type === "html" || type === "pdf") return <IFrameViewer src={path} title={name} />;
    if (type === "image")
      return (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <img src={path} alt={name} className="max-w-full max-h-full object-contain" />
        </div>
      );
    return <div className="p-5 text-base text-gray-700">No preview available.</div>;
  };

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-88 sm:w-96 border-r border-white/50 bg-white/60 backdrop-blur-md p-4 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-xl">Documents</h3>
          <span className="text-base text-gray-600">{files.length}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2 py-2 rounded-lg ${
              viewMode === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-black/5"
            }`}
            title="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-2 py-2 rounded-lg ${
              viewMode === "list" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-black/5"
            }`}
            title="List view"
          >
            <List size={20} />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelected(f)}
              className={`w-full text-left px-3 py-3 rounded-xl hover:bg-black/5 ${
                selected?.name === f.name ? "bg-black/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {iconFor(f.type)}
                <div className="flex-1">
                  <div className="text-lg font-semibold">
                    {/* 🔴 Only TEAM-PHOTO.pdf is red */}
                    <span className={f.name === "salary_bands_confidential.pdf" ? "text-red-600" : "text-gray-900"}>
                      {f.name}
                    </span>
                    {f.suspicious && (
                      <span className="ml-2 text-[11px] text-red-700 border border-red-300 rounded px-1">
                        suspicious
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {f.type} • {f.size} • {f.modified}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <div className="w-full h-full">{renderPreview(selected)}</div>
        ) : (
          <div className="h-full grid place-items-center text-gray-600 text-lg">Select a file to preview.</div>
        )}
      </section>
    </div>
  );
}

/** ---------- Mail ---------- */
function MailApp() {
  const emails = [
    {
      id: 1,
      subject: "Employee Relations",
      from: "d.alvarez@company.com",
      to: "sophia.li@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/employee_relation.html`,
    },
    {
      id: 2,
      subject: "Onboarding Packet",
      from: "sophia.li@company.com",
      to: "e.cooper@mail.com",
      path: `${process.env.PUBLIC_URL}/sim/files/onboarding_packet.html`,
    },
    {
      id: 3,
      subject: "Security Concern",
      from: "alerts@corp.com",
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email.html`,
    },
    {
      id: 4,
      subject: "Dispose Immediately",
      from: "sus@corp.com",
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email2.html`,
    },
    {
      id: 5,
      subject: "Resume Submission",
      from: "sophia.li@company.com",
      to: "careers@northstar-semi.com",
      path: `${process.env.PUBLIC_URL}/sim/files/sophia_resume.html`,
    },
  ];
  const [selected, setSelected] = useState(emails[0]);

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-88 sm:w-96 border-r border-white/50 bg-white/60 backdrop-blur-md overflow-auto">
        <h3 className="px-4 py-3 font-bold text-gray-800 text-xl">Inbox</h3>
        {emails.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelected(e)}
            className={`px-4 py-3 cursor-pointer border-b border-white/50 ${
              selected?.id === e.id ? "bg-black/5" : "hover:bg-black/5"
            }`}
          >
            {/* 🔴 Only "Security Concern" is red */}
            <div
              className={
                ["Security Concern", "Dispose Immediately"].includes(e.subject)
                  ? "font-semibold text-red-600 text-lg"
                  : "font-semibold text-gray-900 text-lg"
              }
            >
              {e.subject}
            </div>
            <div className="text-sm text-gray-600">{e.from}</div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.subject} />
        ) : (
          <div className="h-full grid place-items-center text-gray-600 text-lg">Select an email.</div>
        )}
      </section>
    </div>
  );
}

/** ---------- Browser ---------- */
function BrowserApp() {
  const pages = [
    {
      id: "bank",
      title: "MyBank — Login",
      path: `${process.env.PUBLIC_URL}/sim/files/history-bank.html`,
    },
    {
      id: "awareness",
      title: "Staying Secure: Why Cybersecurity Procedures Matter",
      path: `${process.env.PUBLIC_URL}/sim/files/cyber-article.html`,
    },
    {
      id: "docusign",
      title: "E-sign Offer",
      path: `${process.env.PUBLIC_URL}/sim/files/docusign.html`,
    },
    {
      id: "Silly",
      title: "The Parsnip: Latest News",
      path: `${process.env.PUBLIC_URL}/sim/files/silly-news.html`,
    },
    {
      id: "payroll",
      title: "Payroll",
      path: `${process.env.PUBLIC_URL}/sim/files/payroll.html`,
    },
    {
      id: "disposal",
      title: "Proper and Secure Disposal",
      path: `${process.env.PUBLIC_URL}/sim/files/secure_disposal.html`,
    },
    {
      id: "ehs",
      title: "EHS × Cybersecurity: One Safety Program",
      path: `${process.env.PUBLIC_URL}/sim/files/ehs_cyber.html`,
    },
  ];
  const [selected, setSelected] = useState(pages[0]);

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-88 sm:w-96 border-r border-white/50 bg-white/60 backdrop-blur-md overflow-auto">
        <h3 className="px-4 py-3 font-bold text-gray-800 text-xl">Recent</h3>
        {pages.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className={`px-4 py-3 cursor-pointer border-b border-white/50 ${
              selected?.id === p.id ? "bg-black/5" : "hover:bg-black/5"
            }`}
          >
            <div
              className={
                p.title === "Proper and Secure Disposal"
                  ? "text-base sm:text-lg font-semibold text-red-600"
                  : "text-base sm:text-lg text-gray-900"
              }
            >
              {p.title}
            </div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.title} />
        ) : (
          <div className="h-full grid place-items-center text-gray-600 text-lg">Select a page.</div>
        )}
      </section>
    </div>
  );
}

export default function EscapeRoomDesktop() {
  const { toggle: toggleFullscreen } = useFullscreen("#root");

  // ---- LOGIN / CLOCK STATE ----
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // reveal/hide toggle
  const correctPassword = "Marshmallow2017"; // change to your puzzle password

  // Live clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // ---- DESKTOP WINDOW STATE ----
  const [open, setOpen] = useState({ files: false, mail: false, browser: false });
  const [minimized, setMinimized] = useState({ files: false, mail: false, browser: false });

  // --- LOGIN SCREEN ---
  if (!hasUnlocked) {
    return (
      <div className={`h-screen ${WALLPAPER} relative text-[18px] sm:text-[20px]`}>
        {/* Fullscreen button at top-right */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 px-4 py-2 text-sm sm:text-base rounded-2xl bg-white/30 hover:bg-white/40 text-white backdrop-blur"
          title="Toggle Fullscreen"
        >
          Fullscreen
        </button>

        <div className="absolute inset-0 backdrop-blur-sm" />

        {/* Centered login card */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl p-7 w-[420px] sm:w-[480px] shadow-2xl">
            {/* Clock + Date */}
            <div className="text-center mb-5">
              <div className="text-6xl sm:text-7xl font-light text-gray-900">{timeStr}</div>
              <div className="text-base sm:text-lg text-gray-700">{dateStr}</div>
            </div>

            {/* Avatar + User */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={`${process.env.PUBLIC_URL}/images/avatar.png`}
                alt="User avatar"
                className="w-20 h-20 rounded-full object-cover border border-white/70 shadow"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="text-2xl font-bold text-gray-800 mt-2">Sophia Li</div>
              <div className="text-base text-gray-600">Sign in</div>
            </div>

            {/* Password with reveal toggle */}
            <label className="block text-gray-800 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="w-full relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && password === correctPassword && setHasUnlocked(true)
                }
                className="w-full px-4 pr-12 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 text-[18px] sm:text-[20px]"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-black/5"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button
              onClick={() => password === correctPassword && setHasUnlocked(true)}
              className="mt-4 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
            >
              Sign in
            </button>

            {/* Optional hint */}
            <div className="mt-4 text-lg sm:text-xl text-gray-800 text-center font-medium">
              Hint: "Some notes stick more than others."
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP (after login) ---
  const launch = (key) => setOpen((o) => ({ ...o, [key]: true }));
  const close = (key) => {
    setOpen((o) => ({ ...o, [key]: false }));
    setMinimized((m) => ({ ...m, [key]: false }));
  };
  const minimize = (key) => setMinimized((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className={`min-h-screen ${WALLPAPER} relative overflow-hidden text-[18px] sm:text-[20px]`}>
      {/* DESKTOP ICONS */}
      <div className="absolute top-8 left-8 space-y-7 z-10">
        <button
          onClick={() => launch("files")}
          className="flex flex-col items-center text-white hover:text-white"
          title="File Explorer"
        >
          <div className="w-20 h-20 grid place-items-center bg-white/30 backdrop-blur rounded-3xl shadow">
            <Folder size={30} />
          </div>
          <span className="text-sm mt-2">Files</span>
        </button>
        <button
          onClick={() => launch("mail")}
          className="flex flex-col items-center text-white hover:text-white"
          title="Mail"
        >
          <div className="w-20 h-20 grid place-items-center bg-white/30 backdrop-blur rounded-3xl shadow">
            <Mail size={30} />
          </div>
          <span className="text-sm mt-2">Mail</span>
        </button>
        <button
          onClick={() => launch("browser")}
          className="flex flex-col items-center text-white hover:text-white"
          title="Browser"
        >
          <div className="w-20 h-20 grid place-items-center bg-white/30 backdrop-blur rounded-3xl shadow">
            <Globe size={30} />
          </div>
          <span className="text-sm mt-2">Browser</span>
        </button>
      </div>

      {/* TASKBAR */}
      <div className="fixed left-0 right-0 bottom-0 h-16 bg-black/40 text-white backdrop-blur-xl shadow-2xl flex items-center px-3 gap-3">
        {/* Start */}
        <button
          onClick={() => {}}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/15"
          title="Start"
        >
          <WindowsLogo className="w-7 h-7" />
          <span className="hidden sm:inline text-base">Start</span>
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-2xl bg-white/15 rounded-xl px-4 py-2.5">
          <Search size={20} />
          <input
            className="bg-transparent outline-none text-base placeholder-white/80 w-full"
            placeholder="Type here to search"
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        </div>

        {/* Pinned apps */}
        <div className="flex items-center gap-2 ml-auto sm:ml-3">
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, files: true }));
              setMinimized((m) => ({ ...m, files: false }));
            }}
            className={`px-4 py-2.5 rounded-xl ${open.files ? "bg-white/25" : "hover:bg-white/15"}`}
            title="File Explorer"
          >
            <Folder size={24} />
          </button>
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, mail: true }));
              setMinimized((m) => ({ ...m, mail: false }));
            }}
            className={`px-4 py-2.5 rounded-xl ${open.mail ? "bg-white/25" : "hover:bg-white/15"}`}
            title="Mail"
          >
            <Mail size={24} />
          </button>
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, browser: true }));
              setMinimized((m) => ({ ...m, browser: false }));
            }}
            className={`px-4 py-2.5 rounded-xl ${open.browser ? "bg-white/25" : "hover:bg-white/15"}`}
            title="Browser"
          >
            <Globe size={24} />
          </button>
        </div>
      </div>

      {/* APP WINDOWS */}
      {open.files && !minimized.files && (
        <WindowFrame
          title="File Explorer"
          icon={<Folder size={22} className="text-orange-500" />}
          onClose={() => close("files")}
          onMinimize={() => minimize("files")}
          onMaximize={() => {}}
        >
          <FileExplorer />
        </WindowFrame>
      )}

      {open.mail && !minimized.mail && (
        <WindowFrame
          title="Mail"
          icon={<Mail size={22} className="text-blue-600" />}
          onClose={() => close("mail")}
          onMinimize={() => minimize("mail")}
          onMaximize={() => {}}
        >
          <MailApp />
        </WindowFrame>
      )}

      {open.browser && !minimized.browser && (
        <WindowFrame
          title="Microsoft Edge"
          icon={<Globe size={22} className="text-cyan-500" />}
          onClose={() => close("browser")}
          onMinimize={() => minimize("browser")}
          onMaximize={() => {}}
        >
          <BrowserApp />
        </WindowFrame>
      )}
    </div>
  );
}
