import { useState } from 'react'

const faqs = [
  {
    q: 'Is it really free to launch on these platforms?',
    a: 'Yes. Every platform we use has a free submission route. Some offer paid upgrades like featured spots or skipping the queue; we never use them. A few free routes come with conditions, such as a waiting line or a launch-day score, and we tell you about those up front.',
  },
  {
    q: 'Do you auto-post to Reddit and Hacker News?',
    a: 'No. Communities like Show HN and Reddit ban automated or promotional posts. For those we write a post tailored to each community’s rules, and you publish it from your own account. Launch platforms and directories we submit for you.',
  },
  {
    q: 'What details do I need?',
    a: 'Product name, tagline, a short and a long description, logo, a few screenshots, your website, a category and your maker profile. We reformat everything to each platform’s requirements.',
  },
  {
    q: 'What kind of products does this work for?',
    a: 'It works best for SaaS, AI tools, developer tools, web and mobile apps. Physical products have fewer free launch platforms, but we still match you with the right communities.',
  },
  {
    q: 'When does it launch?',
    a: 'We’re onboarding founders from the waitlist in small batches. Join now and we’ll email you when your spot opens.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section section--light" id="faq">
      <div className="container faq">
        <div className="section__head">
          <p className="kicker">FAQ</p>
          <h2>Questions founders ask us.</h2>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <div key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq__icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
