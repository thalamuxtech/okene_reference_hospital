export const metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold text-slate-900">Terms of service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: April 2026</p>
      <div className="prose prose-slate mt-8 max-w-none">
        <p>
          By using CUSTECH Teaching Hospital, Okene&apos;s digital services you agree to these terms. Services
          are provided for the benefit of patients and licensed healthcare professionals.
        </p>
        <h2 className="mt-10 text-xl font-bold text-slate-900">Medical disclaimer</h2>
        <p>
          Information on this platform is intended to support, not replace, the advice of a
          qualified healthcare provider. In an emergency, call 112 immediately.
        </p>
      </div>
    </div>
  );
}
