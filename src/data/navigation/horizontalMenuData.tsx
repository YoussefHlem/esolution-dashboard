// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Downloads',
    href: '/downloads',
    icon: 'tabler-download'
  },
  {
    label: 'Equipments',
    href: '/equipments',
    icon: 'tabler-tools'
  },
  {
    label: 'News',
    href: '/news',
    icon: 'tabler-news'
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: 'tabler-clipboard-list'
  }
]

export default horizontalMenuData
