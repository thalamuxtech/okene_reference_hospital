'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { useState } from 'react';
import { Bell, Lock, MessageSquare, Save, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<'general' | 'integrations' | 'security' | 'notifications'>('general');

  return (
    <AdminShell title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Configure the hospital system, integrations and staff preferences.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'integrations', label: 'Integrations', icon: MessageSquare },
          { id: 'security', label: 'Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success('Settings saved');
        }}
        className="mt-6"
      >
        {tab === 'general' && <GeneralSettings />}
        {tab === 'integrations' && <IntegrationsSettings />}
        {tab === 'security' && <SecuritySettings />}
        {tab === 'notifications' && <NotificationsSettings />}

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Hospital identity">
        <div>
          <Label>Hospital name</Label>
          <Input defaultValue="Okene Reference Hospital" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>City</Label>
            <Input defaultValue="Okene" />
          </div>
          <div>
            <Label>State</Label>
            <Input defaultValue="Kogi" />
          </div>
        </div>
        <div>
          <Label>Tagline</Label>
          <Input defaultValue="Trusted. Professional. Accessible." />
        </div>
      </Card>

      <Card title="Contact">
        <div>
          <Label>Main phone</Label>
          <Input defaultValue="+234 800 000 0000" />
        </div>
        <div>
          <Label>Emergency hotline</Label>
          <Input defaultValue="112" />
        </div>
        <div>
          <Label>Email</Label>
          <Input defaultValue="care@okenehospital.ng" />
        </div>
      </Card>

      <Card title="Brand" description="Applied across the patient-facing website.">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-navy-500" />
          <div className="flex-1">
            <Label>Primary</Label>
            <Input defaultValue="#008B8B" />
          </div>
        </div>
      </Card>

      <Card title="Operating hours">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Weekday open</Label>
            <Input type="time" defaultValue="08:00" />
          </div>
          <div>
            <Label>Weekday close</Label>
            <Input type="time" defaultValue="20:00" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function IntegrationsSettings() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Africa's Talking" description="SMS, USSD and voice hotline.">
        <div>
          <Label>Username</Label>
          <Input defaultValue="okenehospital" />
        </div>
        <div>
          <Label>Sender ID</Label>
          <Input defaultValue="ORHOSPITAL" />
        </div>
        <div>
          <Label>USSD code</Label>
          <Input defaultValue="*347*100#" />
        </div>
        <div>
          <Label>API key</Label>
          <Input type="password" defaultValue="•••••••••••••••••" />
        </div>
      </Card>

      <Card title="Agora · Video">
        <div>
          <Label>App ID</Label>
          <Input defaultValue="agora-app-id-placeholder" />
        </div>
        <div>
          <Label>App certificate</Label>
          <Input type="password" defaultValue="•••••••••••••••••" />
        </div>
      </Card>

      <Card title="Paystack">
        <div>
          <Label>Public key</Label>
          <Input defaultValue="pk_live_•••••••••••••••••" />
        </div>
        <div>
          <Label>Secret key</Label>
          <Input type="password" defaultValue="•••••••••••••••••" />
        </div>
      </Card>

      <Card title="OpenAI · AI Triage">
        <div>
          <Label>Model</Label>
          <Input defaultValue="gpt-4o" />
        </div>
        <div>
          <Label>API key</Label>
          <Input type="password" defaultValue="•••••••••••••••••" />
        </div>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Admin account">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-navy-500 text-sm font-bold text-white">
            OA
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Okene Administrator</p>
            <p className="text-xs text-slate-500">okene@referencehospital.com</p>
          </div>
        </div>
        <div>
          <Label>Change password</Label>
          <Input type="password" placeholder="New password" />
        </div>
      </Card>

      <Card title="Session & access">
        <Toggle label="Require 2FA for all staff" defaultChecked />
        <Toggle label="Auto-sign-out after 30 min idle" defaultChecked />
        <Toggle label="Log all admin activity" defaultChecked />
        <Toggle label="IP allow-list for admin portal" />
      </Card>
    </div>
  );
}

function NotificationsSettings() {
  return (
    <Card title="Notification defaults">
      <Toggle label="Send 24h appointment reminder (SMS)" defaultChecked />
      <Toggle label="Send 2h appointment reminder (SMS)" defaultChecked />
      <Toggle label="Send 15min telehealth reminder (Push)" defaultChecked />
      <Toggle label="Notify ER team on EMERGENCY triage" defaultChecked />
      <Toggle label="Daily digest email to administrators" defaultChecked />
    </Card>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
      <span className="text-sm text-slate-700">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500">
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
