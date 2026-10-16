const steps = [
  {
    n: '1',
    title: 'Tell us about your product',
    body: 'Name, tagline, description, logo, screenshots, links and category. One form, about ten minutes.',
    tag: '~10 min',
  },
  {
    n: '2',
    title: 'Pick where to launch',
    body: 'We recommend the right platforms for your product type and audience — SaaS, AI tool, dev tool, mobile app — and skip anything paid.',
    tag: 'Smart picks',
  },
  {
    n: '3',
    title: 'Launch everywhere at once',
    body: 'We adapt your details to every platform’s format and submit them, then draft posts for communities like Show HN and Reddit for you to publish.',
    tag: 'One click',
  },
  {
    n: '4',
    title: 'Track what brings users',
    body: 'One dashboard shows every submission’s status, launch dates and which platform actually sends you sign-ups.',
    tag: 'Dashboard',
  },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section__head">
          <p className="kicker">How it works</p>
          <h2>From finished product to launched everywhere in an afternoon.</h2>
        </div>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="step">
              <div className="step__top">
                <span className="step__n">{s.n}</span>
                <span className="tag">{s.tag}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="how__cta">
          <a href="#/demo" className="btn btn--primary">Try the interactive demo →</a>
        </div>
      </div>
    </section>
  )
}
