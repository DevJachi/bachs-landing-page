// Generated from the approved Bachs landing page artifact, then maintained by hand.
export default function Showcase() {
  return (
    <>
      <section className="showcase" aria-labelledby="showcase-title">
        {" "}
        <h2 id="showcase-title" className="sr-only">
          {"Integrate global payments into your product in minutes."}
        </h2>{" "}
        <div className="showcase-notch">
          {" "}
          <div className="showcase-tabs" role="tablist" aria-label="Product views">
            {" "}
            <button className="showcase-tab is-active" role="tab" aria-selected="true" data-tab="Build">
              {"Build"}
            </button>{" "}
            <button className="showcase-tab" role="tab" aria-selected="false" data-tab="Accept">
              {"Accept"}
            </button>{" "}
            <button className="showcase-tab" role="tab" aria-selected="false" data-tab="Settle">
              {"Settle"}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <p className="showcase-description">
          {
            "Built developer-first. Clear documentation, full API control, and one integration for every payment method."
          }
        </p>{" "}
        <div className="showcase-frame">
          {" "}
          <div className="showcase-screen">
            {" "}
            <img
              src="/images/develop.webp"
              alt="Bachs Developer Portal"
              className="showcase-image"
              width="2918"
              height="1454"
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </>
  );
}
