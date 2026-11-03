import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Import models
import {
  User,
  Author,
  Category,
  Tag,
  Article,
  Event,
  Resource,
  SiteSettings,
  Subscriber,
} from '../src/models';

async function seed() {
  console.log('🌱 Starting THEREALCISO database seed...');

  let uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ No MONGODB_URI found. Starting MongoMemoryServer for seeding...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.warn('⚠️ Direct connection failed. Falling back to MongoMemoryServer...', (err as Error).message);
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB.');
  }

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Author.deleteMany({}),
    Category.deleteMany({}),
    Tag.deleteMany({}),
    Article.deleteMany({}),
    Event.deleteMany({}),
    Resource.deleteMany({}),
    SiteSettings.deleteMany({}),
    Subscriber.deleteMany({}),
  ]);

  console.log('Cleaned existing collections.');

  // 1. Seed Users (1 Admin, 1 Editor)
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'CisoAdminSecure2026!';
  const editorPassword = 'CisoEditorSecure2026!';
  const adminHash = await bcrypt.hash(adminPassword, 12);
  const editorHash = await bcrypt.hash(editorPassword, 12);

  const [adminUser] = await User.create([
    {
      name: 'Aditya Vardhan',
      email: (process.env.SEED_ADMIN_EMAIL || 'admin@therealciso.in').toLowerCase(),
      password: adminHash,
      role: 'admin',
      bio: 'Editor-in-Chief & Cybersecurity Strategist. Former enterprise risk advisor with 18+ years in information security governance.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Meenakshi Sundaram',
      email: 'editor@therealciso.in',
      password: editorHash,
      role: 'editor',
      bio: 'Senior Technical Editor covering cloud infrastructure vulnerabilities, regulatory enforcement, and critical infrastructure attacks.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ]);
  console.log('✓ Created Admin & Editor users');

  // 2. Seed Authors (5 distinguished Indian cybersecurity experts)
  const authors = await Author.create([
    {
      name: 'Vikramaditya Sen',
      slug: 'vikramaditya-sen',
      roleTitle: 'Senior Threat Intelligence Fellow',
      bio: 'Former CERT-In technical working group member and cyber defense strategist specializing in nation-state threat vectors, APT monitoring, and critical infrastructure defense in South Asia.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/vikram_sen_sec',
        linkedin: 'https://linkedin.com/in/vikramaditya-sen',
      },
    },
    {
      name: 'Dr. Suniti Sharma',
      slug: 'dr-suniti-sharma',
      roleTitle: 'Director of Privacy & Regulatory Governance',
      bio: 'Distinguished Fellow at the Center for Data Law & Risk. Advisor to major BFSI and telecom boards on DPDP Act readiness, cross-border data transfer structures, and digital trust.',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/drsunitisharma',
        linkedin: 'https://linkedin.com/in/drsunitisharma',
      },
    },
    {
      name: 'Rahul V. Nambiar',
      slug: 'rahul-v-nambiar',
      roleTitle: 'Cloud Security & Identity Architect',
      bio: 'Hands-on security researcher focused on IAM misconfigurations, multi-cloud privilege escalation, and zero-trust perimeter models for high-scale enterprise engineering organizations.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/rahul_cloudsec',
        linkedin: 'https://linkedin.com/in/rahulnambiar',
      },
    },
    {
      name: 'Priya Krishnamurthy',
      slug: 'priya-krishnamurthy',
      roleTitle: 'BFSI Risk & FinTech Security Lead',
      bio: 'Former Chief Information Security Officer for a Tier-1 scheduled commercial bank. Authority on RBI cybersecurity guidelines, UPI fraud containment, and SWIFT security controls.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/priyasecurerisk',
        linkedin: 'https://linkedin.com/in/priyakrishnamurthy',
      },
    },
    {
      name: 'Anirudh Bose',
      slug: 'anirudh-bose',
      roleTitle: 'AI Defense & Red Team Lead',
      bio: 'Offensive AI researcher investigating adversarial LLM jailbreaks, automated vulnerability discovery, and securing neural pipelines across enterprise software stacks.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/anirudhbose_sec',
        linkedin: 'https://linkedin.com/in/anirudhbose',
      },
    },
  ]);
  console.log(`✓ Created ${authors.length} distinguished Authors`);

  // 3. Seed Categories (9 comprehensive categories)
  const categoryDefs = [
    { name: 'News', slug: 'news', order: 1, colorHex: '#0284c7', description: 'Real-time breaking cybersecurity developments, advisories, and industry updates across India.' },
    { name: 'Breaches & Attacks', slug: 'breaches-attacks', order: 2, colorHex: '#e11d48', description: 'Forensic breakdowns of recent corporate intrusions, ransomware incidents, and breach aftermaths.' },
    { name: 'Threats & Vulnerabilities', slug: 'threats-vulnerabilities', order: 3, colorHex: '#d97706', description: 'Zero-day advisories, CVE analysis, active exploitation disclosures, and patching priorities.' },
    { name: 'Privacy & Compliance', slug: 'privacy-compliance', order: 4, colorHex: '#059669', description: 'In-depth analysis of India’s DPDP Act, global regulations, auditor expectations, and compliance frameworks.' },
    { name: 'Cloud & Identity', slug: 'cloud-identity', order: 5, colorHex: '#2563eb', description: 'Securing cloud-native infrastructure, IAM architecture, posture management, and Zero Trust models.' },
    { name: 'AI & Security', slug: 'ai-security', order: 6, colorHex: '#7c3aed', description: 'Generative AI risk, prompt injection vectors, model provenance, and automated defensive telemetry.' },
    { name: 'Policy & Regulation', slug: 'policy-regulation', order: 7, colorHex: '#475569', description: 'CERT-In directives, RBI cybersecurity master directions, SEBI cyber frameworks, and government policies.' },
    { name: 'Opinion', slug: 'opinion', order: 8, colorHex: '#0d9488', description: 'Provocative executive perspectives, boardroom communication strategies, and CISO career leadership.' },
    { name: 'Interviews', slug: 'interviews', order: 9, colorHex: '#db2777', description: 'Exclusive one-on-one sit-downs with leading enterprise CISOs, regulators, and defense chiefs.' },
  ];
  const categories = await Category.create(categoryDefs);
  const catMap = new Map(categories.map((c) => [c.slug, c._id]));
  console.log(`✓ Created ${categories.length} Categories`);

  // 4. Seed Tags
  const tagDefs = [
    { name: 'DPDP Act', slug: 'dpdp-act' },
    { name: 'CERT-In', slug: 'cert-in' },
    { name: 'Ransomware', slug: 'ransomware' },
    { name: 'RBI Guidelines', slug: 'rbi-guidelines' },
    { name: 'Zero Trust', slug: 'zero-trust' },
    { name: 'AI Governance', slug: 'ai-governance' },
    { name: 'Cloud Security', slug: 'cloud-security' },
    { name: 'Supply Chain', slug: 'supply-chain' },
    { name: 'Critical Infrastructure', slug: 'critical-infrastructure' },
    { name: 'Identity & Access', slug: 'identity-access' },
    { name: 'Incident Response', slug: 'incident-response' },
    { name: 'Threat Intelligence', slug: 'threat-intelligence' },
    { name: 'BFSI Risk', slug: 'bfsi-risk' },
    { name: 'Executive Leadership', slug: 'executive-leadership' },
  ];
  const tags = await Tag.create(tagDefs);
  const tagMap = new Map(tags.map((t) => [t.slug, t._id]));
  console.log(`✓ Created ${tags.length} Tags`);

  // 5. Seed Articles (25 high-quality, comprehensive pieces)
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const articleDefs = [
    {
      title: 'CERT-In Issues High-Severity Alert Over Active Zero-Day in Enterprise SSL VPN Gateways',
      slug: 'cert-in-issues-high-severity-alert-over-active-zero-day-ssl-vpn',
      summary: 'Indian computer emergency response team warns of unauthenticated remote code execution impacting major BFSI and government network edges.',
      content: `
        <p>The Indian Computer Emergency Response Team (CERT-In) has issued an urgent vulnerability note (CIVN-2026-0142) warning of an active, unauthenticated remote code execution vulnerability being weaponized against enterprise perimeter devices across India.</p>
        <h2>Vulnerability Mechanics and Attack Vector</h2>
        <p>According to telemetric data observed by regional threat intelligence sensors, threat actors are leveraging crafted HTTP POST requests to trigger a heap buffer overflow in the administrative listener daemon. Successful exploitation affords attackers root-level interactive shell access without requiring prior credentials.</p>
        <blockquote>"Enterprise networks running vulnerable gateway firmware face complete boundary compromise within minutes of port discovery. Immediate patching or air-gapping administrative ports is mandatory," the advisory states.</blockquote>
        <h2>Strategic Recommendations for Indian CISOs</h2>
        <p>Security leaders are advised to execute immediate perimeter discovery audits. Organizations must verify whether external telemetry reveals administrative endpoints exposed to the public internet, restrict ingress access via strict IP whitelisting, and isolate privileged management interfaces behind multi-factor jump hosts.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Enterprise perimeter security devices face heightened targeting across South Asia.',
        alt: 'Network security visualization',
      },
      category: catMap.get('threats-vulnerabilities'),
      tags: [tagMap.get('cert-in'), tagMap.get('threat-intelligence'), tagMap.get('incident-response')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
      readTime: 4,
      views: 3420,
      isFeatured: true,
      isTrending: true,
      severity: 'critical',
      seo: {
        metaTitle: 'CERT-In Issues High-Severity Alert on SSL VPN Gateways | THEREALCISO',
        metaDescription: 'Unauthenticated RCE vulnerability actively exploited against enterprise perimeter devices in India.',
      },
    },
    {
      title: 'Operationalizing the DPDP Act: Why Enterprise Consent Architectures Are Failing Early Audits',
      slug: 'operationalizing-dpdp-act-enterprise-consent-architectures-failing-audits',
      summary: 'Data Protection Board compliance mock drills reveal severe technical shortcomings in legacy CRM data mapping and third-party processor controls.',
      content: `
        <p>As Indian enterprises accelerate preparations for compliance with the Digital Personal Data Protection (DPDP) Act, preliminary technical audits are uncovering substantial friction points in enterprise data architectures.</p>
        <h2>The Granular Consent Conundrum</h2>
        <p>Section 6 of the DPDP Act mandates that consent must be free, specific, informed, unconditional, and unambiguous with a clear affirmative action. However, legacy data warehouses and monolithic customer relation platforms continue to bundle telemetry, service delivery, and marketing consent into single database flags.</p>
        <h2>Third-Party Data Processor Exposure</h2>
        <p>Enterprise data maps frequently lose lineage when customer identifiers traverse external SaaS analytics platforms, cloud customer service vendors, and third-party payment gateways. CISOs must establish real-time data flow telemetry to ensure unconsented data processing ceases immediately upon consent withdrawal.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        caption: 'Complex corporate data flows challenge traditional compliance monitoring frameworks.',
        alt: 'Data compliance architecture',
      },
      category: catMap.get('privacy-compliance'),
      tags: [tagMap.get('dpdp-act'), tagMap.get('executive-leadership')],
      author: authors[1]._id,
      status: 'published',
      publishedAt: new Date(now - 8 * 60 * 60 * 1000),
      readTime: 6,
      views: 5120,
      isFeatured: true,
      isTrending: true,
      severity: 'high',
      seo: {
        metaTitle: 'DPDP Act Consent Architectures: Technical Audit Realities',
        metaDescription: 'Why enterprise consent frameworks are failing preliminary privacy audits under the Indian DPDP Act.',
      },
    },
    {
      title: 'Targeted Ransomware Strike Hits Major Logistics Hub: Critical Supply Chain Lessons for CISOs',
      slug: 'targeted-ransomware-strike-hits-major-logistics-hub-supply-chain-lessons',
      summary: 'A 72-hour operational outage at a key container terminal highlights the perils of IT/OT convergence without micro-segmentation.',
      content: `
        <p>A sophisticated ransomware campaign recently disrupted container tracking and automated gate systems across a premier intermodal transit hub in Western India, causing substantial logistical delays and triggering CERT-In rapid response protocols.</p>
        <h2>Attack Vector: Compromised Remote Contractor Credentials</h2>
        <p>Investigators discovered that the adversaries gained initial access through a third-party vendor maintenance portal lacking mandatory multi-factor authentication. Once inside, the group moved laterally across the flat corporate IT network directly into operational technology (OT) SCADA supervisory control planes.</p>
        <h2>The Air-Gap Myth in Modern Logistics</h2>
        <p>The incident shatters the persistent myth that physical facilities are protected by operational air gaps. In the era of IoT sensor integration and automated telemetry, boundary isolation requires continuous Zero Trust microsegmentation rather than static network perimeters.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Operational technology disruption at freight hubs ripples throughout national trade networks.',
        alt: 'Logistics cargo terminal',
      },
      category: catMap.get('breaches-attacks'),
      tags: [tagMap.get('ransomware'), tagMap.get('supply-chain'), tagMap.get('critical-infrastructure')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 1 * dayMs),
      readTime: 5,
      views: 4890,
      isFeatured: false,
      isTrending: true,
      severity: 'critical',
    },
    {
      title: 'Generative AI in Banking: Safeguarding Retrieval-Augmented Generation Against Indirect Prompt Injection',
      slug: 'generative-ai-in-banking-safeguarding-rag-against-indirect-prompt-injection',
      summary: 'As Indian BFSI institutions deploy internal LLM agents, adversarial prompt injection poses severe data exfiltration and compliance hazards.',
      content: `
        <p>Financial institutions across Mumbai and Bengaluru are rapidly deploying Retrieval-Augmented Generation (RAG) models to empower customer service agents and loan underwriters. However, the intersection of enterprise document stores and external inputs introduces dangerous attack vectors.</p>
        <h2>How Indirect Injection Exploits Trust Boundaries</h2>
        <p>When an enterprise AI agent ingests untrusted external documents—such as uploaded loan application PDFs or counterparty emails—malicious actors can embed invisible instruction overrides that manipulate the LLM into bypassing guardrails or silently leaking customer PII.</p>
        <h2>Defensive Guardrails: Multi-Stage Model Verification</h2>
        <p>Security teams must treat LLMs as untrusted computation nodes. Defensive strategies must incorporate deterministic output validation, separate parsing engines from execution context, and enforce strict least-privilege API scopes for automated tools.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: 'Enterprise neural models require robust input validation pipelines to mitigate injection risks.',
        alt: 'Artificial intelligence digital network',
      },
      category: catMap.get('ai-security'),
      tags: [tagMap.get('ai-governance'), tagMap.get('bfsi-risk')],
      author: authors[4]._id,
      status: 'published',
      publishedAt: new Date(now - 1.5 * dayMs),
      readTime: 7,
      views: 6300,
      isFeatured: true,
      isTrending: true,
      severity: 'high',
    },
    {
      title: 'RBI Cyber Security Framework 2026: The New Mandates for API Gateways and Third-Party FinTechs',
      slug: 'rbi-cyber-security-framework-2026-api-gateways-third-party-fintechs',
      summary: 'Central bank updates directives on continuous automated red teaming, real-time fraud telemetry sharing, and biometric credential binding.',
      content: `
        <p>The Reserve Bank of India has updated its comprehensive Cyber Security Framework, imposing stringent technical standards on scheduled commercial banks, non-banking financial companies (NBFCs), and payment aggregators.</p>
        <h2>Mandatory API Rate Limiting and Behavioral Anomaly Detection</h2>
        <p>Under the revised mandates, all open banking endpoints must incorporate cryptographically signed payloads, granular mutual TLS (mTLS), and AI-driven rate limiting capable of mitigating credential stuffing attacks within sub-second intervals.</p>
        <h2>Board-Level Oversight and 24-Hour Regulatory Notifications</h2>
        <p>The directives mandate quarterly independent red teaming assessments and require executive cybersecurity risk dashboards to be directly reviewed by the Board Audit Committee.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        caption: 'Banking regulators elevate security accountability to boardroom executive committees.',
        alt: 'Financial building and cybersecurity regulation',
      },
      category: catMap.get('policy-regulation'),
      tags: [tagMap.get('rbi-guidelines'), tagMap.get('bfsi-risk')],
      author: authors[3]._id,
      status: 'published',
      publishedAt: new Date(now - 2 * dayMs),
      readTime: 6,
      views: 7420,
      isFeatured: false,
      isTrending: true,
      severity: 'medium',
    },
    {
      title: 'Interview: How Dr. Rajesh Grover Engineered Zero Trust Across 85,000 Distributed Endpoints',
      slug: 'interview-dr-rajesh-grover-zero-trust-distributed-endpoints',
      summary: 'The Chief Security Officer of a global IT services conglomerate reveals the hurdles of cultural resistance, legacy IAM consolidation, and telemetry overload.',
      content: `
        <p>In this exclusive interview, Dr. Rajesh Grover discusses the multi-year journey of retiring perimeter-based VPN tunnels in favor of dynamic identity-driven Zero Trust Network Access (ZTNA) across five continents.</p>
        <h2>"The Perimeter Died Five Years Ago"</h2>
        <p><em>"The moment our workforce became permanently hybrid and engineering workloads migrated to distributed multi-cloud clusters, traditional IP-based firewalls ceased to provide meaningful defense,"</em> Dr. Grover explains.</p>
        <h2>Dealing With Tool Sprawl</h2>
        <p>Grover emphasizes that the primary obstacle for modern CISOs is not a lack of security software, but overwhelming agent sprawl and disconnected alerts. Consolidating detection pipelines into unified behavioral graph telemetry proved decisive.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dr. Rajesh Grover discusses enterprise defense transformations.',
        alt: 'Executive interview in modern office',
      },
      category: catMap.get('interviews'),
      tags: [tagMap.get('zero-trust'), tagMap.get('executive-leadership'), tagMap.get('cloud-security')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 2.5 * dayMs),
      readTime: 8,
      views: 4210,
      isFeatured: false,
      isTrending: false,
      severity: 'none',
    },
    {
      title: 'Kubernetes RBAC Misconfigurations: The #1 Silent Breach Vector in Cloud-Native Indian Startups',
      slug: 'kubernetes-rbac-misconfigurations-silent-breach-vector-cloud-native',
      summary: 'Overprivileged service accounts and exposed etcd clusters expose sensitive secrets in over 60% of audited cloud environments.',
      content: `
        <p>Cloud-native engineering teams prioritizing deployment velocity often grant cluster-admin privileges to service accounts and continuous delivery pipelines, creating catastrophic escalation paths.</p>
        <h2>The Danger of Default Service Account Tokens</h2>
        <p>When pods automount API tokens with excessive permissions, a single compromised container in the ingress tier can be pivoted to dump secrets across all namespaces, granting adversaries cluster-wide persistence.</p>
        <h2>Hardening Checklist for DevSecOps Teams</h2>
        <p>Security engineers must disable automounting of service account tokens by default, implement admission controllers enforcing read-only root filesystems, and conduct automated static analysis on Helm charts before staging promotion.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Securing containerized workloads demands strict cluster admission controls.',
        alt: 'Server nodes and cloud architecture',
      },
      category: catMap.get('cloud-identity'),
      tags: [tagMap.get('cloud-security'), tagMap.get('identity-access')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 3 * dayMs),
      readTime: 5,
      views: 3890,
      isFeatured: false,
      isTrending: false,
      severity: 'medium',
    },
    {
      title: 'Opinion: The Board Doesn’t Care About CVE Scores—How to Speak the Language of Risk',
      slug: 'opinion-board-doesnt-care-about-cve-scores-language-of-risk',
      summary: 'Why technical vulnerability counts alienate non-executive directors and how to translate telemetry into capital allocation and business resilience.',
      content: `
        <p>Walk into a board presentation with 40 slides detailing Common Vulnerability Scoring System (CVSS) matrices, and you will watch senior directors disconnect within five minutes.</p>
        <h2>Translate Technical Debt Into Financial Impact</h2>
        <p>Boards care about three fundamental realities: revenue continuity, regulatory censure, and customer trust. A CISO must articulate how a vulnerable edge gateway threatens quarterly billing or violates contractual SLAs with tier-1 enterprise clients.</p>
        <h2>From "Cost Center" to Strategic Business Enabler</h2>
        <p>When security leadership demonstrates that robust compliance accelerates enterprise deal cycles by weeks, the cybersecurity department transitions from an overhead cost into a strategic revenue partner.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
        caption: 'Effective CISOs bridge the chasm between technical indicators and boardroom strategy.',
        alt: 'Boardroom meeting presentation',
      },
      category: catMap.get('opinion'),
      tags: [tagMap.get('executive-leadership')],
      author: authors[3]._id,
      status: 'published',
      publishedAt: new Date(now - 3.5 * dayMs),
      readTime: 4,
      views: 5800,
      isFeatured: false,
      isTrending: true,
      severity: 'none',
    },
    {
      title: 'Critical Infrastructure Under Siege: State-Sponsored Actors Probe Power Grids in Northern India',
      slug: 'critical-infrastructure-state-sponsored-actors-probe-power-grids',
      summary: 'Cyber intelligence agencies intercept stealth reconnaissance activities targeting substations and energy management protocols.',
      content: `
        <p>Security operations centers monitoring electrical transmission infrastructure reported a noticeable spike in coordinated port scanning and industrial protocol probing during the past fortnight.</p>
        <h2>Modbus and IEC 60870-5-104 Protocol Targeted</h2>
        <p>The reconnaissance specifically focused on industrial communications protocols that lack native cryptographic integrity verification. Threat actors employed domestic VPN proxies to obscure sovereign command-and-control infrastructure.</p>
        <h2>Immediate Defenses: Unidirectional Data Diodes</h2>
        <p>Power utilities have been directed by national authorities to enforce physical unidirectional data diodes between operational dispatch networks and enterprise management zones to eliminate ingress paths.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
        caption: 'National electrical grids require air-gapped isolation from commodity corporate networks.',
        alt: 'Power grid substation lines',
      },
      category: catMap.get('news'),
      tags: [tagMap.get('critical-infrastructure'), tagMap.get('threat-intelligence')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 4 * dayMs),
      readTime: 5,
      views: 8900,
      isFeatured: true,
      isTrending: true,
      severity: 'critical',
    },
    {
      title: 'SEBI Cyber Resilience Framework: What Listed Indian Companies Must Disclose by Q3',
      slug: 'sebi-cyber-resilience-framework-listed-companies-disclose-q3',
      summary: 'The securities watchdog tightens mandatory disclosures on cybersecurity incidents, supply chain third-party reviews, and cyber insurance coverage.',
      content: `
        <p>The Securities and Exchange Board of India (SEBI) has finalized its updated regulatory regime concerning cybersecurity and cyber resilience for market infrastructure institutions and publicly listed entities.</p>
        <h2>Mandatory Material Incident Disclosures</h2>
        <p>Under the enhanced guidelines, any cyber intrusion that impairs operations or compromises sensitive stakeholder data must be formally notified to stock exchanges within the prescribed statutory timeframe.</p>
        <h2>Supply Chain Vulnerability Management</h2>
        <p>Organizations must establish rigorous vendor auditing mechanisms, ensuring software suppliers comply with secure software development life cycle (SSDL) principles and maintain verifiable Software Bills of Materials (SBOMs).</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Stock exchange regulators impose rigorous public transparency standards.',
        alt: 'Financial stock chart',
      },
      category: catMap.get('policy-regulation'),
      tags: [tagMap.get('dpdp-act'), tagMap.get('executive-leadership')],
      author: authors[1]._id,
      status: 'published',
      publishedAt: new Date(now - 4.5 * dayMs),
      readTime: 6,
      views: 3100,
      isFeatured: false,
      isTrending: false,
      severity: 'medium',
    },
    {
      title: 'Deepfake Executive Impersonation: How a Real Estate Major Lost ₹18 Crore to a Fabricated Voice Call',
      slug: 'deepfake-executive-impersonation-real-estate-major-loss-voice-clone',
      summary: 'Adversaries utilized generative voice cloning of the Managing Director to authorize urgent wire transfers to offshore escrow accounts.',
      content: `
        <p>In one of the most brazen social engineering attacks recorded in the country, cybercriminals successfully siphoned ₹18 crore from a prominent Gurugram-based infrastructure developer using AI voice synthesis.</p>
        <h2>The Anatomy of the Deception</h2>
        <p>The attackers harvested public media appearances and earnings call recordings of the firm's Managing Director to train a high-fidelity real-time voice cloning model. They then telephoned the finance controller during a holiday weekend, claiming an urgent confidential acquisition required instant wire clearance.</p>
        <h2>Out-of-Band Multi-Signatory Verification</h2>
        <p>The incident underlines the imperative for dual-control approval workflows. Financial approvals above statutory thresholds must never rely on telephonic or email confirmation alone, but require hardware tokens and verified video multi-party signing.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Synthetic audio and video fraud represents a rapid leap in enterprise spear phishing.',
        alt: 'Cyber crime and financial fraud concept',
      },
      category: catMap.get('breaches-attacks'),
      tags: [tagMap.get('ai-governance'), tagMap.get('bfsi-risk')],
      author: authors[4]._id,
      status: 'published',
      publishedAt: new Date(now - 5 * dayMs),
      readTime: 5,
      views: 9200,
      isFeatured: true,
      isTrending: true,
      severity: 'high',
    },
    {
      title: 'Passkeys vs. Legacy MFA: Evaluating the Enterprise Migration Pathway in High-Volume BFSI',
      slug: 'passkeys-vs-legacy-mfa-evaluating-enterprise-migration-bfsi',
      summary: 'FIDO2 cryptographic credentials eliminate SIM-swapping and adversary-in-the-middle (AiTM) phishing attacks, but deployment hurdles remain.',
      content: `
        <p>With SMS-based OTPs and push notifications increasingly subverted by reverse-proxy phishing kits like Evilginx, enterprise security leaders are accelerating FIDO2 passkey adoption.</p>
        <h2>The Cryptographic Invariance of FIDO2</h2>
        <p>Passkeys bind authentication directly to the origin website URL using public-key cryptography. Even if an employee is lured to a convincing clone domain, the browser will refuse to sign the authentication challenge, rendering credential harvesting ineffective.</p>
        <h2>Device Sync and Enterprise Recovery Models</h2>
        <p>For large organizations, managing hardware YubiKeys versus synchronized cloud passkeys requires clear policy definitions, particularly around corporate offboarding and lost device recovery protocols.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Phishing-resistant authentication protocols redefine access security standards.',
        alt: 'Security key authentication concept',
      },
      category: catMap.get('cloud-identity'),
      tags: [tagMap.get('identity-access'), tagMap.get('zero-trust')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 5.5 * dayMs),
      readTime: 6,
      views: 2950,
      isFeatured: false,
      isTrending: false,
      severity: 'low',
    },
    {
      title: 'Exclusive: Inside the CERT-In National Cyber Coordination Centre (NCCC) Threat Sharing Framework',
      slug: 'inside-cert-in-nccc-national-cyber-coordination-centre-framework',
      summary: 'How automated machine-to-machine threat intelligence feeds are mitigating active botnets across Indian telecommunications backbones.',
      content: `
        <p>The National Cyber Coordination Centre (NCCC) has expanded its automated indicator-of-compromise (IoC) dissemination pipelines, enabling real-time threat ingestion for critical sector SOCs.</p>
        <h2>STIX/TAXII Ingestion at Scale</h2>
        <p>Participating banking and telecom institutions now receive microsecond-level updates on malicious command-and-control IP addresses, domain generation algorithms (DGA), and compromised credential dumps directly into their SIEM platforms.</p>
        <h2>Collaborative Defense Against Sovereign Adversaries</h2>
        <p>Threat researchers emphasize that sovereign defense requires continuous public-private intelligence sharing. Isolated enterprise defenses can no longer withstand state-backed APT campaigns operating on multi-million dollar offensive budgets.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
        caption: 'Coordinated defense feeds strengthen national digital resilience.',
        alt: 'Data telemetry lines',
      },
      category: catMap.get('news'),
      tags: [tagMap.get('cert-in'), tagMap.get('threat-intelligence')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 6 * dayMs),
      readTime: 5,
      views: 4100,
      isFeatured: false,
      isTrending: false,
      severity: 'medium',
    },
    {
      title: 'Cloud Security Posture Management (CSPM): Resolving Alert Fatigue in 10,000-Asset AWS/Azure Estates',
      slug: 'cloud-security-posture-management-resolving-alert-fatigue',
      summary: 'Why risk-based contextual graph modeling beats raw vulnerability scanners by prioritizing reachable attack paths over isolated findings.',
      content: `
        <p>Security engineering teams in rapidly scaling companies are buried under tens of thousands of weekly compliance alerts, leading directly to alert fatigue and missed critical intrusions.</p>
        <h2>Attack Path Analysis: The Antidote to Noise</h2>
        <p>A vulnerable open-source library inside an isolated container with no public IP and no IAM permissions is irrelevant compared to a slightly outdated package running on a public-facing load balancer with write access to production customer buckets.</p>
        <h2>Context-Driven Remediation Workflows</h2>
        <p>By shifting focus from flat vulnerability lists to graph-based attack path modeling, CISOs can reduce actionable tickets by up to 92% while hardening genuine compromise avenues.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
        caption: 'Visualizing relational exposure graphs replaces outdated flat checklist audits.',
        alt: 'Cloud server room infrastructure',
      },
      category: catMap.get('cloud-identity'),
      tags: [tagMap.get('cloud-security'), tagMap.get('identity-access')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 6.5 * dayMs),
      readTime: 7,
      views: 3670,
      isFeatured: false,
      isTrending: false,
      severity: 'low',
    },
    {
      title: 'The Reality of CERT-In 6-Hour Reporting Mandates: Two Years Later, What Has Changed?',
      slug: 'reality-of-cert-in-6-hour-reporting-mandates-two-years-later',
      summary: 'A retrospective analysis of incident notification timelines, forensic readiness, and log retention compliance among Indian mid-market enterprises.',
      content: `
        <p>When CERT-In instituted the 6-hour cybersecurity incident reporting directive in 2022, enterprise security teams sounded alarms regarding feasibility, forensic triage windows, and potential legal exposure.</p>
        <h2>Automated Triage Pipelines Emerge</h2>
        <p>Two years on, the regulation has catalyzed significant investment in automated security orchestration, automation, and response (SOAR) playbooks. Organizations that once took days to confirm initial access now capture automated artifact bundles within minutes.</p>
        <h2>Persistent Log Retention Challenges</h2>
        <p>The requirement to maintain 180 days of secure, tamper-proof logs within domestic borders remains an operational cost hurdle for multinational enterprises operating hybrid architectures.</p>
      `,
      coverImage: {
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        caption: 'Regulatory incident notification timelines drive automation in enterprise security operations.',
        alt: 'Incident response planning document',
      },
      category: catMap.get('opinion'),
      tags: [tagMap.get('cert-in'), tagMap.get('incident-response')],
      author: authors[1]._id,
      status: 'published',
      publishedAt: new Date(now - 7 * dayMs),
      readTime: 6,
      views: 5400,
      isFeatured: false,
      isTrending: false,
      severity: 'medium',
    },
    // Additional 10 high-value articles to reach the 25 required articles
    {
      title: 'GhostToken Vulnerability in Enterprise OAuth: Threat Actors Weaponizing Invisible App Authorizations',
      slug: 'ghosttoken-vulnerability-enterprise-oauth-invisible-authorizations',
      summary: 'Flaw allows adversaries to maintain persistent backdoor access into corporate Google Workspace and Microsoft 365 environments even after password resets.',
      content: '<p>Threat researchers have documented real-world exploitation of dormant OAuth tokens that survive corporate credential invalidations...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80', caption: 'OAuth authorization bypass mechanics', alt: 'Abstract tokens' },
      category: catMap.get('threats-vulnerabilities'),
      tags: [tagMap.get('identity-access'), tagMap.get('cloud-security')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 8 * dayMs),
      readTime: 4,
      views: 2800,
      isFeatured: false,
      isTrending: false,
      severity: 'high',
    },
    {
      title: 'Interview: Shalini Nair on Building Inclusive Cyber Defense Teams in Indian Tech Ecosystems',
      slug: 'interview-shalini-nair-inclusive-cyber-defense-teams-india',
      summary: 'VP of Information Security at a leading fintech unicorn shares pragmatic insights on closing the cybersecurity talent deficit.',
      content: '<p>Shalini Nair discusses mentoring pathways, neurodiversity in threat hunting, and moving past obsolete degree prerequisites in hiring...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=1200&q=80', caption: 'Leadership perspectives on cyber talent development', alt: 'Executive portrait' },
      category: catMap.get('interviews'),
      tags: [tagMap.get('executive-leadership')],
      author: authors[3]._id,
      status: 'published',
      publishedAt: new Date(now - 9 * dayMs),
      readTime: 5,
      views: 1980,
      isFeatured: false,
      isTrending: false,
      severity: 'none',
    },
    {
      title: 'Supply Chain Infiltration: Popular NPM Package Hijacked to Deploy Monero Miners in Indian EdTech Portals',
      slug: 'supply-chain-npm-package-hijacked-monero-miners-edtech',
      summary: 'Compromised maintainer account leads to silent injection of malicious code across thousands of distributed node web servers.',
      content: '<p>A widely adopted JavaScript utility package was compromised via credential stuffing, injecting obfuscated mining payloads...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', caption: 'Open-source software supply chain dependencies under scrutiny', alt: 'Code on screen' },
      category: catMap.get('breaches-attacks'),
      tags: [tagMap.get('supply-chain'), tagMap.get('threat-intelligence')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 10 * dayMs),
      readTime: 4,
      views: 3120,
      isFeatured: false,
      isTrending: false,
      severity: 'high',
    },
    {
      title: 'AI Governance Frameworks for CISOs: Navigating ISO 42001 and Global Trust Benchmarks',
      slug: 'ai-governance-frameworks-cisos-navigating-iso-42001',
      summary: 'A step-by-step roadmap for establishing model transparency, hallucination guardrails, and executive accountability.',
      content: '<p>Implementing ISO/IEC 42001 provides enterprise boards with verifiable assurance that machine learning workflows meet strict ethical and safety baselines...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80', caption: 'Auditing artificial intelligence risk models', alt: 'AI digital art' },
      category: catMap.get('ai-security'),
      tags: [tagMap.get('ai-governance'), tagMap.get('executive-leadership')],
      author: authors[4]._id,
      status: 'published',
      publishedAt: new Date(now - 11 * dayMs),
      readTime: 6,
      views: 2600,
      isFeatured: false,
      isTrending: false,
      severity: 'low',
    },
    {
      title: 'Demystifying Cyber Insurance in India: Why Silent Cyber Clauses Are Disappearing from Corporate Policies',
      slug: 'demystifying-cyber-insurance-silent-cyber-clauses-disappearing',
      summary: 'Underwriters demand verifiable evidence of EDR deployment, multi-factor authentication, and segregated immutable backups before underwriting coverage.',
      content: '<p>The era of vague, omnibus commercial insurance covering ransomware extortion demands is officially over across the Indian subcontinent...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80', caption: 'Cyber risk underwriting shifts to strict technical verification', alt: 'Legal contract document' },
      category: catMap.get('policy-regulation'),
      tags: [tagMap.get('bfsi-risk'), tagMap.get('executive-leadership')],
      author: authors[1]._id,
      status: 'published',
      publishedAt: new Date(now - 12 * dayMs),
      readTime: 5,
      views: 3450,
      isFeatured: false,
      isTrending: false,
      severity: 'none',
    },
    {
      title: 'BGP Hijacking Incidents Reroute Domestic Banking Traffic: The Urgent Case for RPKI Deployment',
      slug: 'bgp-hijacking-incidents-reroute-banking-traffic-rpki-deployment',
      summary: 'Border Gateway Protocol route leaks redirect internet traffic through foreign routing points, prompting ISP compliance mandates.',
      content: '<p>Recent anomalous route advertisements caused sensitive transaction routing to transit overseas ASNs before returning to domestic gateways...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', caption: 'Internet routing security requires Resource Public Key Infrastructure', alt: 'Global internet connections' },
      category: catMap.get('threats-vulnerabilities'),
      tags: [tagMap.get('critical-infrastructure'), tagMap.get('bfsi-risk')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now - 13 * dayMs),
      readTime: 5,
      views: 2900,
      isFeatured: false,
      isTrending: false,
      severity: 'high',
    },
    {
      title: 'Healthcare Ransomware Surge: Small and Mid-Sized Hospitals Become Prime Targets for Extortion Gangs',
      slug: 'healthcare-ransomware-surge-hospitals-prime-targets',
      summary: 'Digitization without cybersecurity hygiene leaves diagnostic networks and electronic health records vulnerable to extortion syndicates.',
      content: '<p>Medical imaging archives and patient triage databases have experienced an unprecedented surge in double-extortion campaigns throughout Tier-2 cities...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Hospital information management systems face extortion pressures', alt: 'Hospital corridor' },
      category: catMap.get('news'),
      tags: [tagMap.get('ransomware'), tagMap.get('incident-response')],
      author: authors[3]._id,
      status: 'published',
      publishedAt: new Date(now - 14 * dayMs),
      readTime: 4,
      views: 4120,
      isFeatured: false,
      isTrending: false,
      severity: 'critical',
    },
    {
      title: 'Opinion: Why Mandatory Bug Bounty Programs Must Become Standard for Public Utilities',
      slug: 'opinion-mandatory-bug-bounty-programs-standard-public-utilities',
      summary: 'Coordinated vulnerability disclosure bridges the gap between independent ethical security researchers and bureaucratic defense bodies.',
      content: '<p>Independent security researchers frequently discover exposed administrative interfaces in civic portals but hesitate to report them due to legal ambiguity...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1200&q=80', caption: 'Ethical disclosure mechanisms foster collaborative resilience', alt: 'Modern workstation' },
      category: catMap.get('opinion'),
      tags: [tagMap.get('executive-leadership')],
      author: authors[4]._id,
      status: 'published',
      publishedAt: new Date(now - 15 * dayMs),
      readTime: 4,
      views: 1850,
      isFeatured: false,
      isTrending: false,
      severity: 'none',
    },
    {
      title: 'Securing the CI/CD Pipeline: Hardening GitHub Actions and GitLab Runners Against Secret Exfiltration',
      slug: 'securing-cicd-pipeline-hardening-actions-runners-secret-exfiltration',
      summary: 'Unpinned third-party actions and pull-request build triggers represent common infiltration pathways for credential-scraping bots.',
      content: '<p>DevOps automation pipelines execute with high-privilege access keys, making them prime targets for silent reconnaissance and build tampering...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80', caption: 'Hardening continuous delivery automation', alt: 'Programming code' },
      category: catMap.get('cloud-identity'),
      tags: [tagMap.get('cloud-security'), tagMap.get('supply-chain')],
      author: authors[2]._id,
      status: 'published',
      publishedAt: new Date(now - 16 * dayMs),
      readTime: 5,
      views: 3100,
      isFeatured: false,
      isTrending: false,
      severity: 'medium',
    },
    // Article 25: A scheduled article in the future to test requirement 2
    {
      title: 'Upcoming Horizon: Quantum-Resistant Cryptography Timelines for Indian Capital Markets',
      slug: 'quantum-resistant-cryptography-timelines-indian-capital-markets',
      summary: 'A futuristic exploration of post-quantum cryptography (PQC) standards and transition benchmarks for algorithmic trading networks.',
      content: '<p>This article is scheduled to publish automatically when the target publication date elapses, validating pull-based scheduling logic...</p>',
      coverImage: { url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80', caption: 'Post-quantum cryptographic transitions', alt: 'Quantum computing art' },
      category: catMap.get('threats-vulnerabilities'),
      tags: [tagMap.get('bfsi-risk'), tagMap.get('threat-intelligence')],
      author: authors[0]._id,
      status: 'published',
      publishedAt: new Date(now + 2 * dayMs), // In the future! Tests Requirement 2 pull-filter
      readTime: 5,
      views: 0,
      isFeatured: false,
      isTrending: false,
      severity: 'none',
    },
  ];

  const createdArticles: any = await Article.create(articleDefs as any);
  console.log(`✓ Created ${createdArticles.length} Articles (including 1 scheduled future article)`);

  // 6. Seed Events (6 Events: 4 Upcoming, 2 Past to test derived status)
  const eventDefs = [
    {
      title: 'India CISO Leadership Summit 2026: Navigating Boardroom Risk & AI Trust',
      slug: 'india-ciso-leadership-summit-2026',
      type: 'summit',
      startDate: new Date(now + 14 * dayMs), // 14 days in future -> Upcoming
      endDate: new Date(now + 15 * dayMs),
      location: 'Grand Hyatt, Mumbai & Hybrid Virtual',
      description: 'The premier annual gathering of 500+ Chief Information Security Officers, regulators, and enterprise risk directors in South Asia.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/register/summit-2026',
      speakers: [
        { name: 'Dr. Suniti Sharma', title: 'Director of Privacy', company: 'Data Law Institute', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Vikramaditya Sen', title: 'Senior Fellow', company: 'Threat Intel Lab', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      title: 'Masterclass: Operationalizing DPDP Act Consent Architectures & Managing Penalties',
      slug: 'masterclass-operationalizing-dpdp-act-consent',
      type: 'webinar',
      startDate: new Date(now + 5 * dayMs), // 5 days in future -> Upcoming
      endDate: new Date(now + 5 * dayMs + 2 * 60 * 60 * 1000),
      location: 'Interactive Zoom Webinar',
      description: 'Technical deep-dive on designing verifiable consent receipts, implementing data erasure APIs, and meeting statutory audits.',
      coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/register/dpdp-masterclass',
      speakers: [
        { name: 'Dr. Suniti Sharma', title: 'Privacy Counsel', company: 'THEREALCISO Advisory', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      title: 'Executive Roundtable: CERT-In 6-Hour Reporting in Practice—Building the Rapid SOC',
      slug: 'executive-roundtable-cert-in-6-hour-reporting',
      type: 'roundtable',
      startDate: new Date(now + 21 * dayMs),
      endDate: new Date(now + 21 * dayMs + 3 * 60 * 60 * 1000),
      location: 'The Leela Palace, Bengaluru',
      description: 'Chatham House rule executive roundtable for banking and critical infrastructure CISOs on orchestrating rapid response and triage.',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/register/cert-in-roundtable',
      speakers: [
        { name: 'Priya Krishnamurthy', title: 'BFSI Risk Lead', company: 'FinTech Defense Alliance', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      title: 'Technical Briefing: Securing GenAI in Enterprise Banking—Guardrails and Mitigations',
      slug: 'technical-briefing-securing-genai-enterprise-banking',
      type: 'webinar',
      startDate: new Date(now + 9 * dayMs),
      endDate: new Date(now + 9 * dayMs + 90 * 60 * 1000),
      location: 'Live Stream & Q&A',
      description: 'Live demonstration of LLM prompt injection defense, model telemetry logging, and preventing customer PII exfiltration.',
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/register/genai-security',
      speakers: [
        { name: 'Anirudh Bose', title: 'AI Red Team Lead', company: 'Neural Defense Labs', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      title: 'Cloud Identity Fabric & Posture Management (CSPM) in Multi-Cloud Enterprises',
      slug: 'cloud-identity-fabric-posture-management-multi-cloud',
      type: 'webinar',
      startDate: new Date(now - 12 * dayMs), // 12 days ago -> Past
      endDate: new Date(now - 12 * dayMs + 2 * 60 * 60 * 1000),
      location: 'Virtual On-Demand Archive',
      description: 'A deep architectural review of unifying IAM roles across AWS, Azure, and Google Cloud with unified least-privilege telemetry.',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/events/archive/cloud-identity-fabric',
      speakers: [
        { name: 'Rahul V. Nambiar', title: 'Cloud Architect', company: 'Identity Research Group', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      title: 'Ransomware Negotiation & Crisis Recovery: The 72-Hour Battlefield Playbook',
      slug: 'ransomware-negotiation-crisis-recovery-playbook-summit',
      type: 'conference',
      startDate: new Date(now - 30 * dayMs), // 30 days ago -> Past
      endDate: new Date(now - 29 * dayMs),
      location: 'India Habitat Centre, New Delhi',
      description: 'Hands-on tabletop crisis simulation involving incident response commanders, forensic negotiators, and crisis communications specialists.',
      coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://therealciso.in/events/archive/ransomware-summit',
      speakers: [
        { name: 'Vikramaditya Sen', title: 'Threat Intelligence Lead', company: 'CERT Advisory Fellow', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ];
  const createdEvents: any = await Event.create(eventDefs as any);
  console.log(`✓ Created ${createdEvents.length} Events (with dynamically derived status)`);

  // 7. Seed Resources (6 Gated Assets: Whitepapers, Reports, Playbooks)
  // Protected fileUrl is hidden by default and served via short-lived signed link!
  const resourceDefs = [
    {
      title: '2026 State of Cybersecurity in India: CISO Benchmark Report',
      slug: '2026-state-of-cybersecurity-india-ciso-benchmark-report',
      type: 'report',
      description: 'An authoritative survey of 280+ enterprise cybersecurity leaders across India analyzing budget allocations, talent retention, AI adoption, and regulatory posture.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-state-of-cybersecurity-2026.pdf',
      authorOrPublisher: 'THEREALCISO Intelligence Lab',
      pagesCount: 48,
      downloadsCount: 1420,
    },
    {
      title: 'The Executive Guide to DPDP Act Readiness & Technical Architecture',
      slug: 'executive-guide-dpdp-act-readiness-technical-architecture',
      type: 'whitepaper',
      description: 'Comprehensive implementation blueprints for enterprise consent management, data principal rights workflows, and Data Protection Board compliance readiness.',
      coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-dpdp-executive-guide.pdf',
      authorOrPublisher: 'Center for Data Law & Risk',
      pagesCount: 36,
      downloadsCount: 2310,
    },
    {
      title: 'Ransomware Incident Response: The 72-Hour CISO Crisis Playbook',
      slug: 'ransomware-incident-response-72-hour-ciso-playbook',
      type: 'playbook',
      description: 'Hour-by-hour operational checklists for containment, forensic preservation, board crisis briefings, CERT-In statutory notifications, and clean recovery.',
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-ransomware-72hr-playbook.pdf',
      authorOrPublisher: 'Regional Cyber Incident Alliance',
      pagesCount: 28,
      downloadsCount: 1890,
    },
    {
      title: 'Zero Trust Architecture for Indian BFSI & Capital Markets',
      slug: 'zero-trust-architecture-indian-bfsi-capital-markets',
      type: 'whitepaper',
      description: 'Pragmatic guidance for transitioning legacy core banking networks into identity-centric microsegmentation without disrupting high-throughput payment settlement.',
      coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-zero-trust-bfsi.pdf',
      authorOrPublisher: 'FinTech Security Forum',
      pagesCount: 42,
      downloadsCount: 1150,
    },
    {
      title: 'AI Security Governance Framework: Auditing Neural Models for CISOs',
      slug: 'ai-security-governance-framework-auditing-neural-models',
      type: 'survey',
      description: 'Field benchmark assessing vulnerability discovery pipelines, data privacy controls, and adversarial red teaming methodologies across 120 tech firms.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-ai-governance-framework.pdf',
      authorOrPublisher: 'Neural Defense Labs',
      pagesCount: 32,
      downloadsCount: 940,
    },
    {
      title: 'Cloud Security Posture & Identity Governance Field Guide',
      slug: 'cloud-security-posture-identity-governance-field-guide',
      type: 'playbook',
      description: 'A tactical handbook for eliminating excessive IAM permissions, automating CSPM remediations, and hardening Kubernetes clusters in AWS and Azure environments.',
      coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      fileUrl: '/downloads/therealciso-cloud-identity-field-guide.pdf',
      authorOrPublisher: 'Cloud Security Council',
      pagesCount: 30,
      downloadsCount: 1670,
    },
  ];
  const createdResources: any = await Resource.create(resourceDefs as any);
  console.log(`✓ Created ${createdResources.length} Gated Resources`);

  // 8. Seed SiteSettings
  await SiteSettings.create({
    siteName: 'THEREALCISO',
    tagline: 'Cybersecurity Intelligence & Executive Risk Insights for Indian Leaders',
    heroArticleId: createdArticles[0]._id,
    tickerNotice: 'CRITICAL ALERT: CERT-In issues urgent advisory on active exploitation of enterprise SSL VPN gateways across Indian BFSI networks.',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/therealciso',
      twitter: 'https://twitter.com/therealciso',
      youtube: 'https://youtube.com/@therealciso',
      rss: '/rss.xml',
    },
    contactEmail: 'editorial@therealciso.in',
    footerText: '© 2026 THEREALCISO. All rights reserved. The independent intelligence journal for cybersecurity and enterprise risk leadership in India and APAC.',
  });
  console.log('✓ Created SiteSettings document');

  // 9. Seed a few initial subscribers
  await Subscriber.create([
    { email: 'ciso.banking@hdfcbank.com', frequency: 'daily', status: 'active' },
    { email: 'risk.officer@tcs.com', frequency: 'weekly', status: 'active' },
    { email: 'cyber.head@airtel.in', frequency: 'daily', status: 'active' },
  ]);
  console.log('✓ Seeded initial Subscribers');

  console.log('\n======================================================');
  console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
  console.log(`Admin Login Email:    ${(process.env.SEED_ADMIN_EMAIL || 'admin@therealciso.in').toLowerCase()}`);
  console.log(`Admin Login Password: ${adminPassword}`);
  console.log(`Editor Login Email:   editor@therealciso.in`);
  console.log(`Editor Login Password:${editorPassword}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
