import { FILLED_ICONS, ICON_PATHS, type IconName } from '../icon-paths';

interface IconProps {
  name: IconName;
  size?: number;
  class?: string;
}

export function Icon({ name, size = 20, class: className }: IconProps) {
  const filled = FILLED_ICONS.has(name);
  return (
    <svg
      class={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
