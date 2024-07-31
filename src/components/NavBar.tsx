import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import NextAuthDialog from 'next-auth-mui';
import Link from 'next/link';
import Head from 'next/head';

const pages = [
  {
    text: 'Dashboard',
    route: '/dashboard',
  },
  {
    text: 'Transactions',
    route: '/transactions',
  },
  {
    text: 'Insights',
    route: '/insights',
  },
];

export function NavBar(props) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { data, status } = useSession();

  console.log('data', data);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    ...(status === 'authenticated'
      ? [
          {
            text: 'Logout',
            onClick: signOut,
          },
        ]
      : [
          {
            text: 'Login',
            onClick: () => setIsAuthDialogOpen(true),
          },
        ]),
  ];

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="https://tenhil.de/wp-content/uploads/2022/04/Tenhil_Logo_RGB_weiss-1024x201.png"
          as="image"
          type="image/png"
        />
      </Head>
      <AppBar position="static" {...props}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 3,
              }}
            >
              <Link href="/">
                <Image
                  fetchPriority="high"
                  width="152"
                  height="30"
                  src="https://tenhil.de/wp-content/uploads/2022/04/Tenhil_Logo_RGB_weiss-1024x201.png"
                  alt="Tenhil Logo"
                />
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                    <Link href={page.route}>
                      <Typography textAlign="center">{page.text}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <Link href="/">
                <Image
                  fetchPriority="high"
                  width="152"
                  height="30"
                  src="https://tenhil.de/wp-content/uploads/2022/04/Tenhil_Logo_RGB_weiss-1024x201.png"
                  alt="Tenhil Logo"
                />
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  href={page.route}
                  LinkComponent={Link}
                  key={page.text}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="User Options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={data?.user?.name || 'User avatar'}
                    src={data?.user?.image || ''}
                    slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.text}
                    onClick={() => {
                      handleCloseUserMenu();
                      (setting.onClick as () => Promise<void>)();
                    }}
                  >
                    <Typography textAlign="center">{setting.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <NextAuthDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        titleText="Login"
        DialogTitleProps={{
          textAlign: 'center',
        }}
      />
    </>
  );
}
