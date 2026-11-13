// Generated from the approved Bachs landing page artifact, then maintained by hand.
export default function SiteNav() {
  return (
    <>
      <nav
        id="nav"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "1000",
          borderBottom: "1px solid",
          borderBottomColor: "rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "90%",
            margin: "0 auto",
            padding: "1rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <a
            href="/"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: "0" }}
          >
            <img src="/images/bachs-lettermark-black.svg" alt="Bachs" style={{ height: "1rem" }} />
          </a>
          <div
            className="nav-desktop-links"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.625rem",
              background: "#ffffff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", padding: "0.5rem 0.25rem" }}>
              <div style={{ position: "relative" }}>
                <a
                  href="#features"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    color: "#111111",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    cursor: "pointer",
                    padding: "0.375rem 0.75rem",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {"Features"}
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    color: "#111111",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    cursor: "pointer",
                    padding: "0.375rem 0.75rem",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {"Developers"}
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <a
                  href="/wordpress"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    color: "#111111",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    cursor: "pointer",
                    padding: "0.375rem 0.75rem",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {"WordPress"}
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    color: "#111111",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    cursor: "pointer",
                    padding: "0.375rem 0.75rem",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {"Resources"}
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <a
                  href="/pricing"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    color: "#111111",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    cursor: "pointer",
                    padding: "0.375rem 0.75rem",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {"Pricing"}
                </a>
              </div>
            </div>
            <a
              href="https://cal.com/collins-uzuegbu-gvs5s7/bachsintro"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0 1rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "2rem",
                margin: "0.375rem 0.375rem 0.375rem 0",
                borderRadius: "0.375rem",
                background: "#111111",
                color: "#ffffff",
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "0.875rem",
                fontWeight: "400",
                textDecoration: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {"Book a Demo"}
            </a>
          </div>
          <div
            className="nav-desktop-actions"
            style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: "0" }}
          >
            <a
              href="https://app.bachs.io/login"
              style={{
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "0.875rem",
                color: "#111111",
                textDecoration: "none",
              }}
            >
              {"Sign in"}
            </a>
            <a
              href="https://app.bachs.io/signup"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "2.25rem",
                padding: "0 1.125rem",
                borderRadius: "9999px",
                background: "#111111",
                color: "#ffffff",
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: "0.875rem",
                fontWeight: "400",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              {"Get Started"}
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "0.3rem" }}>
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </a>
          </div>
          <button
            className="nav-hamburger"
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              flexShrink: "0",
            }}
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#111",
                transition: "transform 0.2s, opacity 0.2s",
                transform: "none",
              }}
            ></span>
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#111",
                transition: "opacity 0.2s",
                opacity: "1",
              }}
            ></span>
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#111",
                transition: "transform 0.2s, opacity 0.2s",
                transform: "none",
              }}
            ></span>
          </button>
        </div>
      </nav>
    </>
  );
}
