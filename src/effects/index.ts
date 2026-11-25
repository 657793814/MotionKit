import type { ComponentType } from 'react'
import type { DemoProps } from '../lib/types'
import Spotlight from './Spotlight'
import Reveal from './Reveal'
import BorderBeam from './BorderBeam'
import Magnetic from './Magnetic'
import ScrollStory from './ScrollStory'
import Tilt3D from './Tilt3D'
import TextDecode from './TextDecode'
import Shimmer from './Shimmer'
import Parallax from './Parallax'
import CountUp from './CountUp'
import HoverLift from './HoverLift'
import Typewriter from './Typewriter'
import Stagger from './Stagger'
import Marquee from './Marquee'
import Spring from './Spring'
import Easing from './Easing'
import ModalDialog from './ModalDialog'
import Toast from './Toast'
import Drawer from './Drawer'
import Popover from './Popover'
import BottomSheet from './BottomSheet'
import Notification from './Notification'
import LiquidGlass from './LiquidGlass'
import PaperPlane from './PaperPlane'
import LongPressMenu from './LongPressMenu'
import Accordion from './Accordion'
import MultiSelectBar from './MultiSelectBar'
import NumberStepper from './NumberStepper'
import CardFlip from './CardFlip'
import SearchFilter from './SearchFilter'
import StepProgress from './StepProgress'
import GlassTabBar from './GlassTabBar'
import GlassToggle from './GlassToggle'
import GlassSlider from './GlassSlider'
import GlassCard from './GlassCard'
import BorderFlow from './BorderFlow'
import BorderNeon from './BorderNeon'
import BorderFade from './BorderFade'
import BorderDust from './BorderDust'
import BorderNebula from './BorderNebula'
import BorderScan from './BorderScan'

export const demos: Record<string, ComponentType<DemoProps>> = {
  spotlight: Spotlight,
  reveal: Reveal,
  borderBeam: BorderBeam,
  magnetic: Magnetic,
  scrollStory: ScrollStory,
  tilt3d: Tilt3D,
  textDecode: TextDecode,
  shimmer: Shimmer,
  parallax: Parallax,
  countUp: CountUp,
  hoverLift: HoverLift,
  typewriter: Typewriter,
  stagger: Stagger,
  marquee: Marquee,
  spring: Spring,
  easing: Easing,
  modalDialog: ModalDialog,
  toast: Toast,
  drawer: Drawer,
  popover: Popover,
  bottomSheet: BottomSheet,
  notification: Notification,
  liquidGlass: LiquidGlass,
  paperPlane: PaperPlane,
  longPressMenu: LongPressMenu,
  accordion: Accordion,
  multiSelectBar: MultiSelectBar,
  numberStepper: NumberStepper,
  cardFlip: CardFlip,
  searchFilter: SearchFilter,
  stepProgress: StepProgress,
  glassTabBar: GlassTabBar,
  glassToggle: GlassToggle,
  glassSlider: GlassSlider,
  glassCard: GlassCard,
  borderFlow: BorderFlow,
  borderNeon: BorderNeon,
  borderFade: BorderFade,
  borderDust: BorderDust,
  borderNebula: BorderNebula,
  borderScan: BorderScan,
}
