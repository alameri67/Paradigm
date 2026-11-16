/** Loading placeholder shown while the simulator hydrates. */
export function SimulatorSkeleton() {
  return (
    <div className="app" aria-busy="true" aria-label="Loading">
      <nav className="side" aria-hidden="true">
        <div className="brand">Simulator</div>
        <div className="search" />
        <div className="sector-list">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="sk sk-row" />
          ))}
        </div>
      </nav>
      <div className="main">
        <header className="topbar">
          <div className="sk" style={{ width: 380, maxWidth: "60vw", height: 54, borderRadius: 999 }} />
        </header>
        <div className="controls">
          <div className="traitbar">
            <div className="sk" style={{ width: 220, height: 40, borderRadius: 999 }} />
            <div className="sk" style={{ width: 240, height: 40, borderRadius: 999 }} />
            <div className="sk" style={{ width: 300, height: 40, borderRadius: 999 }} />
          </div>
          <div className="dialbar">
            <div className="sk" style={{ height: 132, borderRadius: 12 }} />
          </div>
        </div>
        <main className="view">
          <section className="hero">
            <div className="portrait sk" style={{ borderRadius: "50%" }} />
            <div className="hero-body">
              <div className="sk sk-line" style={{ width: 180, height: 24 }} />
              <div className="sk sk-line" style={{ width: 260 }} />
              <div className="sk sk-line" style={{ width: "80%", height: 28, marginTop: 8 }} />
              <div className="sk sk-line" style={{ width: "60%", height: 28 }} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
