// Generated from the approved Bachs landing page artifact, then maintained by hand.
export default function Hero() {
  return (
    <>
      <div className="hero-box">
        {" "}
        <section className="hero">
          {" "}
          <div className="hero-grid hero-centered" id="hero-grid">
            {" "}
            <div>
              {" "}
              <h1 className="display-1 fade-in fade-in-delay-1" style={{ maxWidth: "18ch" }}>
                {" Payments built for "}
                <span style={{ fontFamily: "'Geist Pixel', monospace", whiteSpace: "nowrap" }}>
                  {"internet businesses."}
                </span>{" "}
              </h1>{" "}
              <p
                className="body-lg fade-in fade-in-delay-2"
                style={{ marginTop: "1.5rem", maxWidth: "36rem" }}
              >
                {" "}
                <span className="hero-line">
                  {"Accept payments, automate billing, and monetize your software globally."}
                </span>{" "}
                <span className="hero-line">{"We handle the money, so you can focus on building."}</span>{" "}
              </p>{" "}
              <div className="hero-cta-row fade-in fade-in-delay-3">
                {" "}
                <a
                  href="https://app.bachs.io/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  {" Get Started "}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ marginLeft: "0.25rem" }}
                  >
                    {" "}
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </svg>{" "}
                </a>{" "}
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-lg"
                >
                  {" View docs "}
                </a>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
      </div>
    </>
  );
}
