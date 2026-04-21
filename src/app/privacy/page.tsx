export const metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold text-slate-900">Privacy policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: April 2026</p>
      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          Okene Reference Hospital (&ldquo;ORH&rdquo;) is committed to protecting your privacy. This
          policy describes how we collect, use and safeguard personal and medical information in
          accordance with the Nigeria Data Protection Regulation (NDPR) and aligned international
          standards.
        </p>
        <h2 className="mt-10 text-xl font-bold text-slate-900">What we collect</h2>
        <ul className="mt-3 list-disc pl-6 text-slate-700">
          <li>Identity and contact details (name, phone, email, address).</li>
          <li>Medical records, vitals, prescriptions, lab and imaging results.</li>
          <li>Appointment history and queue status.</li>
          <li>Telehealth session metadata and, with consent, recordings.</li>
        </ul>
        <h2 className="mt-10 text-xl font-bold text-slate-900">How we protect it</h2>
        <p className="text-slate-700">
          All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is role-based and
          audited. Backups are encrypted and geo-replicated.
        </p>
      </div>
    </div>
  );
}
