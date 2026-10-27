import {
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Briefcase,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Eye,
  FileText,
  House,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Phone,
  Shield,
  Users,
  X,
} from 'lucide-react';

// Named icons so data files can refer to them by string.
const icons = {
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  award: Award,
  briefcase: Briefcase,
  chart: BarChart3,
  check: Check,
  chevronDown: ChevronDown,
  clock: Clock,
  close: X,
  code: Code2,
  eye: Eye,
  fileText: FileText,
  handshake: Handshake,
  home: House,
  layers: Layers,
  mail: Mail,
  mapPin: MapPin,
  megaphone: Megaphone,
  menu: Menu,
  messageCircle: MessageCircle,
  messageSquare: MessageSquare,
  phone: Phone,
  shield: Shield,
  users: Users,
};

export default function Icon({ name, size = 20, ...props }) {
  const Component = icons[name];
  return <Component size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" {...props} />;
}

export function IconBox({ name, size = 'md' }) {
  return (
    <span className={`icon-box icon-box--${size}`}>
      <Icon name={name} size={size === 'lg' ? 26 : 22} />
    </span>
  );
}
