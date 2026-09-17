import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Camera,
  Car,
  Cat,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Copy,
  Dog,
  ExternalLink,
  Eye,
  Gift,
  HandHeart,
  Handshake,
  Heart,
  House,
  Info,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  PawPrint,
  Phone,
  Repeat,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  Users,
  X,
  type LucideProps,
} from 'lucide-react';
import type { IconName } from '@/lib/content/types';

const contentIcons: Record<IconName, React.ComponentType<LucideProps>> = {
  heart: Heart,
  paw: PawPrint,
  dog: Dog,
  cat: Cat,
  house: House,
  'hand-heart': HandHeart,
  users: Users,
  gift: Gift,
  'shield-check': ShieldCheck,
  clock: Clock,
  info: Info,
  stethoscope: Stethoscope,
  car: Car,
  camera: Camera,
  megaphone: Megaphone,
  handshake: Handshake,
  'badge-check': BadgeCheck,
  dollar: CircleDollarSign,
  repeat: Repeat,
  truck: Truck,
  calendar: Calendar,
  'map-pin': MapPin,
  mail: Mail,
  phone: Phone,
  sparkles: Sparkles,
  check: Check,
};

const uiIcons = { ArrowRight, ChevronDown, Copy, ExternalLink, Eye, Menu, Search, Share2, X, Check, Calendar, MapPin, Clock };

export type UiIconName = keyof typeof uiIcons;

/** Editor-selectable icon by name. Decorative unless a label is given. */
export function Icon({ name, size = 24, label, className = '' }: { name: IconName; size?: number; label?: string; className?: string }) {
  const C = contentIcons[name] ?? PawPrint;
  return <C size={size} strokeWidth={1.75} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} className={className} />;
}

export function UiIcon({ name, size = 20, label, className = '' }: { name: UiIconName; size?: number; label?: string; className?: string }) {
  const C = uiIcons[name];
  return <C size={size} strokeWidth={2} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} className={className} />;
}

/** Brand marks Lucide no longer ships. Decorative; the link text carries the name. */
export function FacebookMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3Z" />
    </svg>
  );
}

export function InstagramMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
