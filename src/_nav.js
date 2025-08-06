import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilSpeedometer, cibAudible,cibCoursera,cibCodeship,cibElectron,cibBlackberry } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'

const _nav = [
/*_________________________________________________________________*/  

  // {
  //   component: CNavItem,
  //   name: 'Mediciones',
  //   to: '/mediciones',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },


/*_________________________________________________________________*/  
  {
    component: CNavGroup,
    name: 'Mediciones',
    to: '/mediciones',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Hidrodinámicas',
        to: '/mediciones',
        icon: <CIcon icon={cibCodeship} customClassName="nav-icon" />,
      },
        {
        component: CNavItem,
        name: 'Sedimentos',
        to: '/sedimentos',
        icon: <CIcon icon={cibBlackberry} customClassName="nav-icon" />,
      },
    ],

  },
 /*_________________________________________________________________*/
  {
    component: CNavGroup,
    name: 'Morfología',
    to: '/morfologia',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Costas',
        to: '/morfologia/costa',
        icon: <CIcon icon={cibAudible} customClassName="nav-icon" />,
      },
    ],
  },
/*_________________________________________________________________*/

    {
      component: CNavGroup,
      name: 'Modelaciones',
      to: '/modelaciones',
      icon: <CIcon icon={cibElectron} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Marea',
          to: '/modelaciones/marea',
          icon: <CIcon icon={cibCoursera} customClassName="nav-icon" />,
        },
      ],
    },
/*_________________________________________________________________*/

    {
      component: CNavGroup,
      name: 'Canal',
      to: '/canal',
      icon: <CIcon icon={cibElectron} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Canal',
          to: '/canal/buenaventura',
          icon: <CIcon icon={cibCoursera} customClassName="nav-icon" />,
        },
      ],
    },


]

export default _nav
