// Generated from the approved Bachs landing page artifact, then maintained by hand.
export default function AnnounceBar() {
  return (
    <>
      <a className="announce-bar" href="https://bachs.io/wordpress">
        <span className="announce-text">
          <span className="announce-tag">{"New"}</span> <strong>{"Bachs for WordPress."}</strong>
          <span className="announce-more">{" Accept payments with or without WooCommerce"}</span>
        </span>
        <svg
          className="announce-arrow"
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </>
  );
}
