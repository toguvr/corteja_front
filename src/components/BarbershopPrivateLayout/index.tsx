import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAuth } from '../../hooks/auth';
import PurchaseDialog from '../PurchaseDialog';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { key } from '../../config/key';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { useBalance } from '../../hooks/balance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { toast } from 'react-toastify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

const drawerWidth = 240;

const menuItems = [
  {
    label: 'Dashboard',
    icon: <CalendarTodayIcon />,
    page: '/empresa/dashboard',
  },
  {
    label: 'Agenda',
    icon: <BookOnlineIcon />,
    page: '/empresa/agenda',
  },
  {
    label: 'Barbeiros',
    icon: <PeopleIcon />,
    page: '/empresa/profissionais',
  },
  // {
  //   label: 'Fidelidade',
  //   icon: <CardGiftcardIcon />,
  //   page: '/empresa/agenda',
  // },
  {
    label: 'Horários',
    icon: <AccessTimeIcon />,
    page: '/empresa/horarios',
  },
  {
    label: 'Serviços',
    icon: <ContentCutIcon />,
    page: '/empresa/servicos',
  },
  {
    label: 'Planos',
    icon: <MonetizationOnIcon />,
    page: '/empresa/planos',
  },
  {
    label: 'Extrato',
    icon: <ReceiptLongIcon />,
    page: '/empresa/extrato',
  },
];
const menuItemsBottom = [
  // {
  //   label: 'Agendamentos',
  //   icon: <EventAvailableIcon />,
  //   page: '/agendamentos',
  // },
  // {
  //   label: 'Extrato',
  //   icon: <ReceiptLongIcon />,
  //   page: '/extrato',
  // },

  // { label: 'Perfil', icon: <PersonIcon />, page: '/perfil' },
  { label: 'Sair', icon: <LogoutIcon /> },
];
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

export default function BarbershopPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const slug = localStorage.getItem(key.slug);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { balance } = useBalance();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openForm, setOpenForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpenForm(true);
  };
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      sx={{ marginTop: '45px' }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
      <MenuItem onClick={signOut}>Sair</MenuItem>
    </Menu>
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            HoraCerta
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {/* <IconButton
              onClick={() => {
                const link = `https://app.com/${user.slug}`;
                navigator.clipboard.writeText(link);
                toast.success('Link copiado!');
              }}
              sx={{ p: 1 }}
            >
              <Tooltip title="Copiar link da barbearia">
                <ContentCopyIcon />
              </Tooltip>
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={location.pathname === item.page} // 👈 Aqui é o destaque
                onClick={item.page ? () => navigate(item.page) : signOut}
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open
                    ? { justifyContent: 'initial' }
                    : { justifyContent: 'center' },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: 'center' },
                    open ? { mr: 3 } : { mr: 'auto' },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {menuItemsBottom.map((item, index) => (
            <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={location.pathname === item.page}
                onClick={item.page ? () => navigate(item.page) : signOut}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          alignSelf: 'center',
          px: 1,
          py: 3,
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <DrawerHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            alignSelf: 'center',
            maxWidth: '1150px',
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
      {renderMenu}
      <PurchaseDialog openForm={openForm} setOpenForm={setOpenForm} />
    </Box>
  );
}
