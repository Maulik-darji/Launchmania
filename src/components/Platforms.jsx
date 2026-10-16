import { useState } from 'react'
import { categories, excludedPlatforms, totalPlatforms } from '../data/platforms.js'

function domain(url) {
  return new URL(url).hostname.replace(/^www\./, '')
}

export default function Platforms() {
  const [active, setActive] = useState(categories[0].id)
  const cat = categories.find((c) => c.id === active)

  return (
    <section className="section section--light" id="platforms">
      <div className="container">
        <div className="section__head section__head--split">
          <div>
            <p className="kicker">Where we launch you</p>
            <h2>{totalPlatforms} platforms with a free route. Zero paid upgrades.</h2>
          </div>
          <p className="muted">
            We only use the free submission option on every platform. No expedited reviews, no featured
            placements, no surprise checkout.
          </p>
        </div>

        <div className="tabs" role="tablist" aria-label="Platform categories">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              className={`tab ${active === c.id ? 'is-active' : ''}`}
              onClick={() => setActive(c.id)}
            >
              <span className="tab__label">{c.label}</span>
              <span className="tab__count">{c.items.length}</span>
            </button>
          ))}
        </div>

        <div className="tabpanel" role="tabpanel">
          <div className="tabpanel__intro">
            <p>{cat.blurb}</p>
            <span className="tag tag--solid">{cat.how}</span>
          </div>
          <ul className="platforms">
            {cat.items.map((p) => (
              <li key={p.name} className="platform">
                <div className="platform__head">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain(p.url)}&sz=64`}
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="platform__name">
                    {p.name}
                  </a>
                </div>
                <p className="platform__for">{p.bestFor}</p>
                <span className="platform__free">{p.free}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="excluded">
          <div>
            <h3>Platforms we skip</h3>
            <p className="muted">Often listed as free in old blog posts, but not ₹0 today.</p>
          </div>
          <ul>
            {excludedPlatforms.map((p) => (
              <li key={p.name}>
                <strong>{p.name}</strong>
                <span>{p.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
