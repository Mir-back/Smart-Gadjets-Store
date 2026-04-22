export function AboutPage() {
  return (
    <section className="page fade-up">
      <h1>About Us</h1>
      <p className="page-subtitle">
        Smart Gadgets Store is an online shop focused on affordable accessories
        and practical gadgets for study, work and daily life.
      </p>

      <div className="card about-card">
        <h2>What we sell</h2>
        <p>
          We provide value-first products: wireless earbuds, keyboards, mice,
          chargers, power banks and useful desktop accessories.
        </p>
        <h2>Our mission</h2>
        <p>
          Make modern tech accessible without overpaying. We maintain a clean
          catalog, transparent pricing and simple UX.
        </p>
      </div>

      <div className="card about-card">
        <h2>Contact</h2>
        <p>
          Phone: <a href="tel:+996706389191">+996 (706) 38 9191</a>
        </p>
        <p>
          Email:{' '}
          <a href="mailto:support@smartgadgets.store">support@smartgadgets.store</a>
        </p>
      </div>
    </section>
  )
}
