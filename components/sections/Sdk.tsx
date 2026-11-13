// Generated from the approved Bachs landing page artifact, then maintained by hand.
export default function Sdk() {
  return (
    <>
      <section className="sdk2" aria-labelledby="sdk-title">
        {" "}
        <div className="sdk2-wrap">
          {" "}
          <header className="sdk2-head">
            {" "}
            <p className="subheading">{"Integrate in under a minute"}</p>{" "}
            <h2 id="sdk-title" className="sdk2-heading">
              <span className="soft">{"Official SDKs,"}</span>
              {" or plain HTTP."}
            </h2>{" "}
            <p className="sdk2-lede">
              {"Node.js, Python, and Go clients, and a REST API for everything else."}
            </p>{" "}
          </header>{" "}
          <div className="sdk2-tabs" role="tablist" aria-label="Language">
            {" "}
            <button role="tab" aria-selected="true" className="is-active" data-sdk="Node.js">
              {"Node.js"}
            </button>{" "}
            <button role="tab" aria-selected="false" data-sdk="Python">
              {"Python"}
            </button>{" "}
            <button role="tab" aria-selected="false" data-sdk="Go">
              {"Go"}
            </button>{" "}
            <button role="tab" aria-selected="false" data-sdk="REST API">
              {"REST API"}
            </button>{" "}
          </div>{" "}
          <div className="sdk2-grid">
            {" "}
            <div className="sdk2-copy">
              {" "}
              <h3 className="sdk2-title">{"Node.js SDK"}</h3>{" "}
              <p className="sdk2-desc">
                {
                  "Build payment flows in Node.js with a comprehensive client for checkout sessions, subscriptions, webhooks, and settlement workflows."
                }
              </p>{" "}
              <ul className="sdk2-list">
                {" "}
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M5.5 8.2l1.7 1.7 3.3-3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{"Hosted Checkout Sessions"}</span>
                </li>{" "}
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M5.5 8.2l1.7 1.7 3.3-3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{"Subscription Lifecycle APIs"}</span>
                </li>{" "}
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M5.5 8.2l1.7 1.7 3.3-3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{"Webhook Signature Verification"}</span>
                </li>{" "}
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M5.5 8.2l1.7 1.7 3.3-3.6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{"Tax & Settlement Controls"}</span>
                </li>{" "}
              </ul>{" "}
              <a className="sdk2-docs" href="https://docs.bachs.io" target="_blank" rel="noopener noreferrer">
                {"Read the docs"}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>{" "}
            </div>{" "}
            <div className="sdk2-window">
              {" "}
              <div className="sdk2-bar">
                {" "}
                <span className="sdk2-file">{"api/checkout/route.ts"}</span>{" "}
                <button className="sdk2-copybtn" type="button">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="5.25"
                      y="5.25"
                      width="8.5"
                      height="8.5"
                      rx="1.75"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M10.5 3.5V3.25A1.5 1.5 0 0 0 9 1.75H3.25a1.5 1.5 0 0 0-1.5 1.5V9a1.5 1.5 0 0 0 1.5 1.5h.25"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                  <span>{"Copy"}</span>
                </button>{" "}
              </div>{" "}
              <div className="sdk2-code">
                <ol className="sdk2-lines"></ol>
              </div>{" "}
              <div className="sdk2-term"></div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </>
  );
}
