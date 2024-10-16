import { Icon } from '@iconify/react';
import { SideNavItem } from './types';


export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Inicio',
    path: '/home',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Usuarios',
<<<<<<< HEAD
    path: '/usuarioslista',
=======
    path: '/usuarios',
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
    icon: <Icon icon="lucide:user" width="24" height="24" />,
  },
  {
    title: 'Vehiculos',
    path: '/lista',
    icon: <Icon icon="lucide:truck" width="24" height="24" />,
  },
  {
    title: 'Ajustes',
    path: '/settings',
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
  },
  {
    title: 'Ayuda',
    path: '/help',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];