const pains = [
  {
    n: '01',
    title: 'You don’t know where to go',
    body: 'There are hundreds of launch sites and directories. Half are paid, some are dead, and the free ones are buried in old blog lists.',
  },
  {
    n: '02',
    title: 'Every site wants a different form',
    body: 'Tagline length, logo size, screenshots, categories, maker profile. Filling 40 forms by hand eats a full week you should spend on the product.',
  },
  {
    n: '03',
    title: 'Timing and rules trip you up',
    body: 'Queues months long, launch-day scoring, subreddits that ban links. One wrong move and your launch is wasted.',
  },
]

export default function Problem() {
  return (
    <section className="section section--light">
      <div className="container">
        <div className="section__head">
          <p className="kicker">The problem</p>
          <h2>You built it. Now where do the first 100 users come from?</h2>
        </div>
        <div className="grid grid--3">
          {pains.map((p) => (
            <article key={p.n} className="card card--light">
              <span className="card__num">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
