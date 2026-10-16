const phases = [
  {
    when: 'Week 1',
    title: 'Launch discovery',
    body: 'Hit the launch platforms first for a concentrated spike of early adopters and feedback.',
    items: ['Product Hunt', 'Peerlist Launchpad', 'OpenHunts', 'MicroLaunch', 'Uneed'],
  },
  {
    when: 'Week 2',
    title: 'Permanent listings',
    body: 'Lock in directory listings that keep bringing search traffic and backlinks for years.',
    items: ['AlternativeTo', 'SaaSHub', 'SourceForge', 'G2', 'Capterra'],
  },
  {
    when: 'Week 3',
    title: 'Community exposure',
    body: 'Share your story where founders and builders hang out, with posts written for each community’s rules.',
    items: ['Show HN', 'Reddit', 'Indie Hackers', 'DEV Community', 'LinkedIn'],
  },
]

export default function Sequence() {
  return (
    <section className="section" id="sequence">
      <div className="container">
        <div className="section__head">
          <p className="kicker">The launch plan</p>
          <h2>Not a spray-and-pray. A three-week sequence that compounds.</h2>
        </div>
        <div className="sequence">
          {phases.map((p, i) => (
            <article key={p.when} className="phase">
              <div className="phase__when">
                <span>{p.when}</span>
                <span className="phase__idx">0{i + 1}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <ul className="chips">
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
