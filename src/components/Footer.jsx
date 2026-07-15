import { useState } from 'react';
import { Briefcase, Camera, Code2, Mail, Send } from 'lucide-react';

const navigation = [['Company', [['About', '#about'], ['Team', '#team'], ['Contact', '#contact']]], ['Explore', [['Capabilities', '#services'], ['Projects', '#projects'], ['Process', '#process']]], ['Legal', [['Privacy', '#'], ['Terms', '#']]]];
const socials = [{ Icon: Code2, label: 'GitHub' }, { Icon: Briefcase, label: 'LinkedIn' }, { Icon: Camera, label: 'Instagram' }, { Icon: Mail, label: 'Email' }];

export default function Footer() {
  const [email, setEmail] = useState(''); const [subscribed, setSubscribed] = useState(false);
  return <footer className="finale-footer relative overflow-hidden"><div className="finale-earth" /><div className="finale-particles" /><div className="finale-content relative z-10 max-w-6xl mx-auto px-6 py-24"><section className="finale-hero"><div className="finale-logo"><i /><i /><span>N</span></div><p className="finale-wordmark">NEURALL</p><h2>The Future Isn’t Waiting.<br /><em>Neither Are We.</em></h2></section><div className="finale-links">{navigation.map(([title, links]) => <nav key={title}><span>{title}</span>{links.map(([label, target]) => <a key={label} href={target}>{label}</a>)}</nav>)}<div className="finale-newsletter"><span>STAY CONNECTED WITH THE FUTURE</span>{subscribed ? <p>Signal received. Welcome to the future.</p> : <form onSubmit={(event) => { event.preventDefault(); if (email) { setSubscribed(true); setEmail(''); } }}><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" /><button aria-label="Subscribe" type="submit"><Send size={15} /></button></form>}</div></div><div className="finale-bottom"><p>© {new Date().getFullYear()} Neurall. Building the future with intelligence.</p><div>{socials.map(({ Icon, label }) => <a href="#" key={label} aria-label={label}><Icon size={15} /></a>)}</div></div></div></footer>;
}
