import React from 'react';
import { Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const icons = {
  'arrow-back': require('../../assets/new_icons/arrow_back_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  assignment: require('../../assets/new_icons/assignment_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'assignment-add': require('../../assets/new_icons/assignment_add_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'assignment-ind': require('../../assets/new_icons/assignment_ind_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'assignment-late': require('../../assets/new_icons/assignment_late_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'assignment-returned': require('../../assets/new_icons/assignment_returned_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  business: require('../../assets/new_icons/business_center_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  description: require('../../assets/new_icons/description_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  domain: require('../../assets/new_icons/domain_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  home: require('../../assets/new_icons/home_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'home-work': require('../../assets/new_icons/home_work_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'hourglass-empty': require('../../assets/new_icons/hourglass_empty_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  info: require('../../assets/new_icons/domain_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  logout: require('../../assets/new_icons/logout_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  menu: require('../../assets/new_icons/menu_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'menu-book': require('../../assets/new_icons/menu_book_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  notifications: require('../../assets/new_icons/notifications_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'notifications-unread': require('../../assets/new_icons/notifications_unread_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  newReleases: require('../../assets/new_icons/update_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  person: require('../../assets/new_icons/person_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  report: require('../../assets/new_icons/report_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  refresh: require('../../assets/new_icons/refresh_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  schema: require('../../assets/new_icons/schema_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  search: require('../../assets/new_icons/search_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  sync: require('../../assets/new_icons/sync_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'sync-problem': require('../../assets/new_icons/sync_problem_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'system-update-alt': require('../../assets/new_icons/system_update_alt_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  update: require('../../assets/new_icons/update_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  task: require('../../assets/new_icons/task_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  visibility: require('../../assets/new_icons/visibility_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  'visibility-off': require('../../assets/new_icons/visibility_off_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
  wifi: require('../../assets/new_icons/wifi_48dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png'),
} as const;

export type IconName =
  | keyof typeof icons
  | React.ComponentProps<typeof MaterialIcons>['name'];

interface Props {
  name: IconName;
  size: number;
  color?: string;
}

export default function Icon({ name, size, color }: Props) {
  const source = (icons as Record<string, any>)[name];

  if (source) {
    return (
      <Image
        source={source}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    );
  }

  return <MaterialIcons name={name} size={size} color={color} />;
}
