import {
  ArrowsClockwiseIcon,
  AtomIcon,
  CloudArrowUpIcon,
  CloudIcon,
  CubeIcon,
  DatabaseIcon,
  FilePyIcon,
  GithubLogoIcon,
  GitMergeIcon,
  IdentificationBadgeIcon,
  InfinityIcon,
  KeyIcon,
  LightningIcon,
  RobotIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SteeringWheelIcon,
  TrainIcon,
  TriangleIcon,
} from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";

import { type ContentIconName } from "@/content-icons";

const ICONS: Record<ContentIconName, Icon> = {
  "git-merge": GitMergeIcon,
  "cloud-arrow-up": CloudArrowUpIcon,
  "rocket-launch": RocketLaunchIcon,
  infinity: InfinityIcon,
  "steering-wheel": SteeringWheelIcon,
  cube: CubeIcon,
  cloud: CloudIcon,
  "github-logo": GithubLogoIcon,
  "arrows-clockwise": ArrowsClockwiseIcon,
  "file-py": FilePyIcon,
  lightning: LightningIcon,
  atom: AtomIcon,
  database: DatabaseIcon,
  train: TrainIcon,
  triangle: TriangleIcon,
  "shield-check": ShieldCheckIcon,
  "identification-badge": IdentificationBadgeIcon,
  key: KeyIcon,
  robot: RobotIcon,
};

export function ContentIcon({ name, className }: { name: ContentIconName; className?: string }) {
  const IconCmp = ICONS[name];
  return <IconCmp aria-hidden="true" className={className} />;
}
