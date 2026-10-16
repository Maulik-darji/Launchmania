// Free launch / listing / community platforms, last reviewed 16 Oct 2026.
// "free" describes the zero-cost route only; paid upgrades are ignored.

export const launchPlatforms = [
  { name: 'Product Hunt', url: 'https://www.producthunt.com/launch', free: 'Free', bestFor: 'SaaS, apps, AI products' },
  { name: 'Uneed', url: 'https://www.uneed.best/', free: 'Free queue', bestFor: 'SaaS and tech tools' },
  { name: 'Peerlist Launchpad', url: 'https://peerlist.io/', free: 'Free', bestFor: 'Developer and design products' },
  { name: 'OpenHunts', url: 'https://openhunts.com/', free: 'Free slots', bestFor: 'Startups and MVPs' },
  { name: 'MicroLaunch', url: 'https://microlaunch.net/', free: 'Free queue', bestFor: 'Micro-SaaS, indie products' },
  { name: 'Fazier', url: 'https://fazier.com/', free: 'Conditional free', bestFor: 'SaaS and startups' },
  { name: 'TinyLaunch', url: 'https://tinylaunch.com/', free: 'Free standard', bestFor: 'Small apps and side projects' },
  { name: 'Smol Launch', url: 'https://smollaunch.com/', free: 'Conditional free', bestFor: 'Indie products' },
  { name: 'DevHunt', url: 'https://devhunt.org/', free: 'Free listing', bestFor: 'Developer tools' },
  { name: 'IndieNeed', url: 'https://www.indieneed.com/', free: 'Free listing', bestFor: 'Indie makers' },
  { name: 'Alt Hunt', url: 'https://althunt.io/', free: 'Free core publishing', bestFor: 'Software alternatives' },
  { name: 'HiCyou', url: 'https://hicyou.com/', free: 'Free queue', bestFor: 'SaaS directories' },
]

export const directoryPlatforms = [
  { name: 'AlternativeTo', url: 'https://alternativeto.net/', free: 'Free submission', bestFor: 'Users searching for alternatives' },
  { name: 'SaaSHub', url: 'https://www.saashub.com/', free: 'Free submission', bestFor: 'SaaS comparison traffic' },
  { name: 'Launching Next', url: 'https://www.launchingnext.com/', free: 'Free submission', bestFor: 'New startups' },
  { name: 'StartupBase', url: 'https://startupbase.io/', free: 'Free queue', bestFor: 'Early-stage startups' },
  { name: 'Startup Fame', url: 'https://startupfa.me/', free: 'Free route', bestFor: 'Startup discovery' },
  { name: 'SaaSCity', url: 'https://saascity.io/', free: 'Free listing', bestFor: 'SaaS products' },
  { name: 'Toolfound', url: 'https://toolfound.com/', free: 'Limited free slots', bestFor: 'Tools and utilities' },
  { name: 'YourHack AI', url: 'https://yourhack.ai/', free: 'Free listing', bestFor: 'AI tools' },
  { name: 'PeerPush', url: 'https://peerpush.net/', free: 'Free submission', bestFor: 'Indie products' },
  { name: 'SourceForge', url: 'https://sourceforge.net/software/vendors/', free: 'Basic listing', bestFor: 'Business software buyers' },
  { name: 'G2', url: 'https://www.g2.com/', free: 'Basic profile', bestFor: 'B2B reviews' },
  { name: 'Capterra', url: 'https://www.capterra.com/', free: 'Basic listing', bestFor: 'SMB software buyers' },
  { name: 'GetApp', url: 'https://www.getapp.com/', free: 'Via Gartner Digital Markets', bestFor: 'SMB software buyers' },
  { name: 'Software Advice', url: 'https://www.softwareadvice.com/', free: 'Via Gartner Digital Markets', bestFor: 'Software buyers' },
]

export const communityPlatforms = [
  { name: 'Hacker News — Show HN', url: 'https://news.ycombinator.com/show', free: 'Free post', bestFor: 'Working technology people can try' },
  { name: 'Indie Hackers', url: 'https://www.indiehackers.com/', free: 'Free post', bestFor: 'Founder feedback and traction' },
  { name: 'r/SideProject', url: 'https://www.reddit.com/r/SideProject/', free: 'Free post', bestFor: 'Demoing your product' },
  { name: 'r/SaaS', url: 'https://www.reddit.com/r/SaaS/', free: 'Free post', bestFor: 'SaaS feedback, rules apply' },
  { name: 'r/Entrepreneur', url: 'https://www.reddit.com/r/Entrepreneur/', free: 'Free post', bestFor: 'Business discussion' },
  { name: 'DEV Community', url: 'https://dev.to/', free: 'Free article', bestFor: 'Technical launch article' },
  { name: 'Hashnode', url: 'https://hashnode.com/', free: 'Free article', bestFor: 'Technical content' },
  { name: 'GitHub', url: 'https://github.com/', free: 'Free repo', bestFor: 'Open-source products' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/', free: 'Free post', bestFor: 'B2B and professional users' },
  { name: 'X', url: 'https://x.com/', free: 'Free post', bestFor: 'Build-in-public launches' },
  { name: 'HackerNoon', url: 'https://hackernoon.com/', free: 'Free article', bestFor: 'Tech articles, needs approval' },
  { name: 'Medium', url: 'https://medium.com/', free: 'Free article', bestFor: 'Product storytelling' },
  { name: 'Quora', url: 'https://www.quora.com/', free: 'Free answer', bestFor: 'Relevant answers' },
]

export const excludedPlatforms = [
  { name: 'BetaList', reason: 'Paid submission reported in October 2026' },
  { name: "There's An AI For That", reason: 'Paid tool submission reported' },
  { name: 'Toolify', reason: 'Paid submission reported' },
  { name: 'AppSumo', reason: 'Revenue share, not truly zero-cost' },
  { name: 'OpenLaunch', reason: 'Free queue reported booked into 2027' },
]

export const categories = [
  {
    id: 'launch',
    label: 'Launch platforms',
    short: 'Launch',
    blurb: 'Product Hunt-style launch days. Upvotes, comments and a spike of early adopters.',
    how: 'We submit for you',
    items: launchPlatforms,
  },
  {
    id: 'directories',
    label: 'Directories',
    short: 'Directories',
    blurb: 'Permanent listings that keep sending search traffic and backlinks long after launch day.',
    how: 'We submit for you',
    items: directoryPlatforms,
  },
  {
    id: 'communities',
    label: 'Communities',
    short: 'Communities',
    blurb: 'Places where real people talk. They ban bots, so we write the post and you publish it.',
    how: 'We draft, you post',
    items: communityPlatforms,
  },
]

export const totalPlatforms = categories.reduce((n, c) => n + c.items.length, 0)
