'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Monitor,
  MoreHorizontal
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { DOCTORS } from '@/lib/seed-data';

export default function TelehealthDemo() {
  const doctor = DOCTORS[1];
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-slate-950 text-white">
      {/* Main video area */}
      <div className="relative mx-auto flex h-[calc(100vh-5rem)] max-w-7xl flex-col p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <p className="text-sm font-semibold">Live · {formatted}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-md bg-white/5 px-2 py-1">Encrypted · Agora</span>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-navy-900 shadow-2xl">
          {/* Animated ambient */}
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,139,139,0.25),transparent_70%)]"
          />

          {/* Doctor video (simulated) */}
          <div className="relative flex h-full items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <Image
                  src={doctor.photoURL}
                  alt={doctor.firstName}
                  width={160}
                  height={160}
                  className="h-40 w-40 rounded-full object-cover ring-4 ring-white/20"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary-400/50"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <p className="mt-5 text-xl font-bold">
                {doctor.title ?? 'Dr.'} {doctor.firstName} {doctor.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-300">{doctor.specialization[0]}</p>
            </motion.div>
          </div>

          {/* Self PIP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 right-4 h-32 w-40 overflow-hidden rounded-xl border-2 border-white/20 bg-slate-700 shadow-xl sm:h-36 sm:w-48"
          >
            {cam ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white/40 text-xs">
                Your camera
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <VideoOff className="h-6 w-6 text-slate-500" />
              </div>
            )}
          </motion.div>

          {/* Chat drawer */}
          {chatOpen && (
            <motion.aside
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="absolute bottom-4 right-4 top-4 flex w-72 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <p className="text-sm font-bold">Chat</p>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
                <div className="rounded-lg bg-white/10 p-2">
                  <p className="text-slate-400">Doctor · 10:02</p>
                  <p>Hello! Can you describe your symptoms?</p>
                </div>
              </div>
              <div className="border-t border-white/10 p-3">
                <input
                  placeholder="Type a message…"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </motion.aside>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <ControlBtn active={mic} onClick={() => setMic((v) => !v)} label="Mic">
            {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </ControlBtn>
          <ControlBtn active={cam} onClick={() => setCam((v) => !v)} label="Camera">
            {cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </ControlBtn>
          <ControlBtn active={false} onClick={() => {}} label="Share">
            <Monitor className="h-5 w-5" />
          </ControlBtn>
          <ControlBtn active={chatOpen} onClick={() => setChatOpen((v) => !v)} label="Chat">
            <MessageSquare className="h-5 w-5" />
          </ControlBtn>
          <ControlBtn active={false} onClick={() => {}} label="Notes">
            <FileText className="h-5 w-5" />
          </ControlBtn>

          <Link
            href="/dashboard"
            className="ml-2 flex h-12 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
          >
            <PhoneOff className="h-5 w-5" />
            End
          </Link>

          <ControlBtn active={false} onClick={() => {}} label="More">
            <MoreHorizontal className="h-5 w-5" />
          </ControlBtn>
        </div>
      </div>
    </div>
  );
}

function ControlBtn({
  children,
  active,
  onClick,
  label
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/15'
      }`}
    >
      {children}
    </motion.button>
  );
}
