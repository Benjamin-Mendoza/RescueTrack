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
    path: '/usuarioslista',

    icon: <Icon icon="lucide:user" width="24" height="24" />,
  },
  {
    title: 'Vehiculos',
    path: '/lista',
    icon: <Icon icon="lucide:truck" width="24" height="24" />,
  },
  {
    title: 'Historial Mantenciones',
    path: '/historial',
    icon: <Icon icon="lucide:truck" width="24" height="24" />,
  },
  {
    title: 'Cerrar Sesión',
    path: '/logout', 
    icon: <Icon icon="lucide:log-out" width="24" height="24" />,
  },
];