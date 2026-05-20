import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { route: '/formulaire', emoji: '🌐', color: '#C9A050', colorRgb: '201,160,80', title: 'Création de Site Web', desc: "Nous créons votre site sur mesure selon les standards internationaux.", tags: ['Design premium', 'Mobile-first', 'Standards secteur'], meta: '5 étapes · ~10 min' },
  { route: '/optimisation', emoji: '🔧', color: '#E87C3E', colorRgb: '232,124,62', title: 'Optimisation de Site', desc: "Votre site existe mais performe mal ? Nous auditons et améliorons la performance, le SEO, le design et les conversions.", tags: ['Audit complet', 'SEO & Vitesse', 'Conversions'], meta: '4 étapes · ~7 min' },
  { route: '/workflows', emoji: '⚙️', color: '#5B8AF5', colorRgb: '91,138,245', title: 'Workflows & Automatisation', desc: 'Automatisez vos tâches répétitives. WhatsApp, emails, reporting, suivi dossiers — nous construisons vos flux intelligents sur mesure.', tags: ['Agents IA', 'n8n / Make', 'Gain de temps'], meta: '4 étapes · ~7 min' },
  { route: '/whatsapp-ia', emoji: '💬', color: '#25C984', colorRgb: '37,201,132', title: 'Agent WhatsApp IA', desc: 'Un assistant IA répond à vos clients 24h/24 sur WhatsApp. Devis, rendez-vous, FAQ — automatisé, personnalisé, toujours disponible.', tags: ['24h/24', 'Multi-langues', 'Escalade intelligente'], meta: '3 étapes · ~5 min' },
];

export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div style={{ background: '#070B17', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 46, height: 46, borderRadius: 11, background: 'linear-gradient(135deg,#C9A050,#E4BC5A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#070B17', fontWeight: 800, fontSize: 18 }}>FW</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>FlexWay</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.2 }}>Quelle solution vous intéresse ?</h1>
          <p style={{ color: '#8892B0', fontSize: 17, margin: '0 auto', maxWidth: 520, lineHeight: 1.6 }}>Remplissez la fiche correspondante à votre besoin. Notre équipe reviendra vers vous sous 48h avec une proposition.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {SERVICES.map(s => (
            <div key={s.route}
              style={{ background: '#0D1428', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => nav(s.route)}
            >
              <div style={{ height: 4, background: s.color }} />
              <div style={{ padding: '28px 26px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${s.colorRgb},0.1)`, border: `1px solid rgba(${s.colorRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{s.emoji}</div>
                <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>{s.title}</h2>
                <p style={{ color: '#8892B0', fontSize: 13.5, lineHeight: 1.65, margin: '0 0 20px', flex: 1 }}>{s.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 20, background: `rgba(${s.colorRgb},0.08)`, border: `1px solid rgba(${s.colorRgb},0.2)`, color: s.color, fontSize: 11, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#2D3F5E', fontSize: 12 }}>{s.meta}</span>
                  <button style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: s.color, color: '#070B17', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); nav(s.route); }}>Commencer →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#1A2540', fontSize: 12, marginTop: 48 }}>© 2025 FlexWay — Toutes vos informations restent strictement confidentielles</p>
      </div>
    </div>
  );
}
