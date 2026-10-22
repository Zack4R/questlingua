import {
  Blocks,
  Clock,
  Coins,
  Eye,
  FileText,
  Flag,
  Hand,
  Heart,
  KeyRound,
  ListChecks,
  Lock,
  Map,
  MessageSquare,
  Mic,
  MicOff,
  PenLine,
  Shield,
  ShoppingCart,
  Siren,
  Trophy,
  User,
  type LucideIcon,
} from 'lucide-react'
import type { MissionIconName } from '../../content/missions'
import type { MethodIconName } from '../../content/methodology'
import type { SafetyIconName } from '../../content/safety'

export const missionIcons: Record<MissionIconName, LucideIcon> = {
  hand: Hand,
  map: Map,
  cart: ShoppingCart,
  key: KeyRound,
  blocks: Blocks,
  siren: Siren,
  flag: Flag,
  trophy: Trophy,
}

export const methodIcons: Record<MethodIconName, LucideIcon> = {
  mic: Mic,
  list: ListChecks,
  eye: Eye,
  message: MessageSquare,
  pen: PenLine,
}

export const safetyIcons: Record<SafetyIconName, LucideIcon> = {
  lock: Lock,
  user: User,
  'mic-off': MicOff,
  shield: Shield,
  coins: Coins,
  clock: Clock,
  file: FileText,
  heart: Heart,
}
