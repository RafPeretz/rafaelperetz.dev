import {
  ArrowsClockwiseIcon,
  AtomIcon,
  BrowsersIcon,
  CloudArrowUpIcon,
  CloudIcon,
  CodeIcon,
  CubeIcon,
  DatabaseIcon,
  FilePyIcon,
  GithubLogoIcon,
  GitMergeIcon,
  GraduationCapIcon,
  IdentificationBadgeIcon,
  InfinityIcon,
  KeyIcon,
  LightningIcon,
  RobotIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ShieldStarIcon,
  SteeringWheelIcon,
  TrainIcon,
  TriangleIcon,
} from "@phosphor-icons/react/ssr";
import { type Icon, type IconWeight } from "@phosphor-icons/react";

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
  browsers: BrowsersIcon,
  code: CodeIcon,
  "graduation-cap": GraduationCapIcon,
  "shield-star": ShieldStarIcon,
};

export function ContentIcon({
  name,
  className,
  weight,
}: {
  name: ContentIconName;
  className?: string;
  weight?: IconWeight;
}) {
  const IconCmp = ICONS[name];
  return <IconCmp aria-hidden="true" weight={weight} className={className} />;
}
