import React from 'react';

const CARD = '#0D1428', TXT = '#fff', SUB = '#8892B0';

interface Plan {
  name: string; price: string; priceNote?: string; tagline: string;
  features: string[]; footer: string[]; featured?: boolean; badge?: string;
}
interface Service { title: string; subtitle: string; color: string; plans: Plan[]; }

const SERVICES: Service[] = [
  {
    title: 'SERVICE 01 — Création de site web',
    subtitle: 'Paiement unique · Livraison 14 jours · Échelonnement : 40 % commande / 30 % mi-projet / 30 % livraison',
    color: '#C9A050',
    plans: [
      { name: 'ESSENTIEL', price: '200 000 FCFA', tagline: 'Pour les courtiers et petites compagnies qui veulent une présence en ligne professionnelle.', features: ['5 à 6 pages (Accueil, À propos, Services, Agences, Contact)', 'Design professionnel adapté au secteur assurance', 'Responsive mobile-first', 'Formulaire de contact et demande de devis', 'Affichage agrément CIMA et mentions légales', 'Optimisation de base (vitesse, SEO technique)', '1 révision incluse'], footer: ['Livraison 14 jours', 'Support 30 jours email', 'Hébergement non inclus'] },
      { name: 'PRO', price: '325 000 FCFA', tagline: 'Pour les compagnies établies qui veulent un site complet, gérable en autonomie, avec un vrai impact commercial.', features: ['Tout ce qui est inclus dans Essentiel', '8 à 12 pages (+ Blog, Produits détaillés, FAQ, Espace presse)', 'Design premium sur mesure avec animations légères', 'Système de gestion de contenu (CMS) — modifiable en autonomie', 'Bouton WhatsApp flottant intégré', 'Intégration Google Analytics', 'Optimisation SEO approfondie + certificat SSL', '2 révisions incluses'], footer: ['Livraison 14 jours', 'Support 60 jours email + WhatsApp', 'Hébergement non inclus'], featured: true, badge: 'Le plus choisi' },
      { name: 'PREMIUM', price: '470 000 FCFA', tagline: 'Pour les grands groupes et multi-branches qui veulent un site de référence, complet et techniquement avancé.', features: ['Tout ce qui est inclus dans Pro', 'Pages illimitées selon architecture validée', 'Espace client sécurisé (suivi dossier basique)', 'Animations avancées et design signature', 'Site bilingue français + anglais', 'Intégration widget WhatsApp IA', 'Performance Core Web Vitals optimisée', '3 révisions incluses'], footer: ['Livraison 14 jours', 'Support 90 jours prioritaire', 'Hébergement non inclus'] },
    ],
  },
  {
    title: 'SERVICE 02 — Optimisation de site existant',
    subtitle: 'Paiement unique · Audit 50 000 FCFA déductible si tu continues',
    color: '#E87C3E',
    plans: [
      { name: 'AUDIT SEUL', price: '50 000 FCFA', priceNote: 'déductible', tagline: "Un rapport complet et actionnable avant toute décision d'investissement sur votre site.", features: ['Analyse complète par IA (performance, SEO, UX, mobile)', 'Rapport 20 à 30 points identifiés et classés par priorité', 'Score avant/après simulé pour chaque correction', "Plan d'action (critique / important / optionnel)", 'Estimation du coût de chaque correction', 'Livrable PDF professionnel'], footer: ['Livraison 5 jours', 'Déductible si poursuite avec Corrections ou Refonte'] },
      { name: 'AUDIT + CORRECTIONS', price: '195 000 FCFA', tagline: "L'audit complet suivi de l'implémentation des corrections les plus impactantes. 50 000 FCFA déduits = 145 000 FCFA de corrections effectives.", features: ["Tout ce qui est inclus dans l'Audit", 'Correction des 10 points critiques identifiés', 'Optimisation de la vitesse de chargement', 'Correction des erreurs SEO techniques', 'Mise en conformité mobile', 'Rapport comparatif avant/après avec scores'], footer: ['Livraison 14 jours', 'Support 30 jours post-livraison'], featured: true, badge: 'Recommandé' },
      { name: 'REFONTE COMPLÈTE', price: 'Sur devis', priceNote: '350 000 – 600 000 FCFA', tagline: "Quand l'existant est trop dégradé pour être corrigé à la marge — on repart sur des bases saines.", features: ['Audit complet inclus en point de départ', 'Nouveau design basé sur les résultats de l\'audit', 'Reprise et optimisation de tout le contenu existant', 'Livrables équivalents à Création Pro ou Premium selon scope', 'Appel de cadrage offert avant devis'], footer: ['Devis sous 48 h', 'Livraison 14 jours'] },
    ],
  },
  {
    title: 'SERVICE 03 — Workflows & Automatisation',
    subtitle: 'Abonnement mensuel · Sans engagement · Audit processus 50 000 FCFA déductible du premier mois',
    color: '#5B8AF5',
    plans: [
      { name: 'STARTER', price: '49 000 FCFA', priceNote: '/mois', tagline: 'Pour les PME qui veulent automatiser leurs premières tâches répétitives sans engagement lourd.', features: ["Jusqu'à 5 workflows automatisés", 'Relances clients, notifications, rapports hebdomadaires', 'Intégrations : WhatsApp, Email, Google Sheets', 'IA de base (classification, réponses automatiques simples)', 'Tableau de bord de suivi basique', '1 modification de workflow incluse par mois'], footer: ['Mise en place 7 jours', 'Support email réponse sous 48 h'] },
      { name: 'PRO', price: '97 000 FCFA', priceNote: '/mois', tagline: 'Pour les compagnies qui veulent un vrai gain de temps mesurable chaque semaine.', features: ["Jusqu'à 15 workflows automatisés", 'Agents IA autonomes (traitement documents, qualification leads)', 'Intégrations avancées : CRM, ERP, logiciels métier assurance', 'Reporting automatique hebdomadaire + mensuel', 'Tableau de bord temps réel', 'Alertes et notifications intelligentes', '3 modifications de workflows incluses par mois'], footer: ['Mise en place 7 à 10 jours', 'Support WhatsApp sous 24 h'], featured: true, badge: 'Le plus choisi' },
      { name: 'ENTREPRISE', price: '185 000 FCFA', priceNote: '/mois', tagline: "Pour les groupes avec des process complexes qui ont besoin d'une architecture IA sur mesure et d'un SLA garanti.", features: ['Workflows illimités', 'Architecture multi-agents IA sur mesure', 'Intégrations custom avec systèmes existants', 'Traitement automatique de documents (PDF, formulaires, sinistres)', 'Rapport mensuel de performance + recommandations', 'Réunion mensuelle de suivi (visio)', 'Modifications illimitées'], footer: ['Mise en place sur mesure', 'Support WhatsApp dédié sous 4 h', 'SLA 99,5 % garanti'] },
    ],
  },
  {
    title: 'SERVICE 04 — Agent WhatsApp IA',
    subtitle: 'Abonnement mensuel · Sans engagement · Configuration incluse',
    color: '#25C984',
    plans: [
      { name: 'ESSENTIEL', price: '45 000 FCFA', priceNote: '/mois', tagline: 'Pour les courtiers et petites structures qui ne veulent plus manquer aucun message.', features: ['1 numéro WhatsApp Business connecté', 'Réponses automatiques 24 h/24, 7 j/7', "Base de connaissances jusqu'à 30 questions / réponses", "Détection d'intention (FAQ, devis, sinistre, RDV)", 'Escalade automatique vers agent humain', 'Rapports hebdomadaires (volume, sujets fréquents)', 'Langue : français', '1 mise à jour de la base de connaissances par mois'], footer: ['Mise en place 7 jours', 'Support email sous 48 h'] },
      { name: 'PRO', price: '75 000 FCFA', priceNote: '/mois', tagline: 'Pour les compagnies avec un volume significatif qui veulent automatiser la qualification et la prise de RDV.', features: ['Tout ce qui est inclus dans Essentiel', "Base de connaissances jusqu'à 100 questions / réponses", 'Prise de rendez-vous automatisée', 'Collecte et qualification de leads entrants', 'Multilingue : français + 1 autre langue (dioula, anglais, etc.)', 'Intégration agenda / calendrier', 'Tableau de bord conversations en temps réel', 'Rapports hebdomadaires + mensuel détaillé', '3 mises à jour de la base de connaissances par mois'], footer: ['Mise en place 7 jours', 'Support WhatsApp sous 24 h'], featured: true, badge: 'Le plus choisi' },
      { name: 'ENTREPRISE', price: '110 000 FCFA', priceNote: '/mois', tagline: "Pour les grands groupes avec de forts volumes qui ont besoin d'une IA avancée et d'intégrations sur mesure.", features: ['Tout ce qui est inclus dans Pro', 'Base de connaissances illimitée', 'Toutes les langues demandées', 'Option IA premium (Claude Haiku) pour cas complexes', 'Génération automatique de devis', 'Intégration avec logiciel de gestion existant', "Règles d'escalade entièrement personnalisées", "Rapport mensuel + recommandations d'optimisation", 'Mises à jour illimitées'], footer: ['Mise en place 7 à 10 jours', 'Support WhatsApp dédié sous 4 h', 'SLA 99,5 % garanti'] },
    ],
  },
];

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '255,255,255';
  return `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`;
}

function PlanCard({ plan, color }: { plan: Plan; color: string }) {
  return (
    <div style={{ background: CARD, border: plan.featured ? `2px solid ${color}` : '1px solid #1A2540', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column' }}>
      {plan.badge && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ background: `rgba(${hexToRgb(color)}, 0.12)`, color, border: `1px solid rgba(${hexToRgb(color)}, 0.3)`, fontSize: 11, borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>{plan.badge}</span>
        </div>
      )}
      <p style={{ color, fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>{plan.name}</p>
      <div style={{ marginBottom: 10 }}>
        <span style={{ color: TXT, fontSize: 22, fontWeight: 600 }}>{plan.price}</span>
        {plan.priceNote && <span style={{ color: SUB, fontSize: 13, marginLeft: 6 }}>{plan.priceNote}</span>}
      </div>
      <p style={{ color: SUB, fontSize: 12, lineHeight: 1.6, margin: '0 0 16px' }}>{plan.tagline}</p>
      <div style={{ borderTop: '1px solid #1A2540', paddingTop: 14, marginBottom: 16, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
            <span style={{ color, fontSize: 13, flexShrink: 0, lineHeight: '18px' }}>✓</span>
            <span style={{ color: SUB, fontSize: 13, lineHeight: '18px' }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #1A2540', paddingTop: 12 }}>
        {plan.footer.map((line, i) => <p key={i} style={{ color: '#4A5568', fontSize: 11, margin: i === 0 ? '0 0 3px' : '3px 0 0' }}>{line}</p>)}
      </div>
    </div>
  );
}

export default function PricingView() {
  return (
    <div style={{ fontFamily: 'Inter,sans-serif' }}>
      <style>{`.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}@media(max-width:768px){.pricing-grid{grid-template-columns:1fr}}`}</style>
      {SERVICES.map((service, si) => (
        <div key={si} style={{ marginBottom: 40 }}>
          {si > 0 && <div style={{ borderTop: '1px solid #1A2540', marginBottom: 32 }} />}
          <div style={{ marginBottom: 18 }}>
            <p style={{ color: service.color, fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>{service.title}</p>
            <p style={{ color: SUB, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{service.subtitle}</p>
          </div>
          <div className="pricing-grid">
            {service.plans.map((plan, pi) => <PlanCard key={pi} plan={plan} color={service.color} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
