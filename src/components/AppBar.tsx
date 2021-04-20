import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { MyDrawer } from './drawer/Drawer';
import { User } from '../models/models';
import { Avatar, Button, Link } from '@material-ui/core';
import ProfileMenu from './ProfileMenu';
import { logout } from '../features/session/sessionSlice';
import { useDispatch } from 'react-redux';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: 10,
  },
}));

interface Props {
  user: User | null;
}

interface ProfileOrLoginProps {
  user: User | null;
}

// tslint:disable-next-line variable-name
const LoginButton: React.FunctionComponent = () => {
  return (
    <Link href={'/signin'}>
      <Button color="inherit">Sign In</Button>
    </Link>
  );
};

export interface IProfileButtonProps {
  user: User;
  onClickLogout: () => void;
}

const ProfileButton: React.FunctionComponent<IProfileButtonProps> = (props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClickProfileButton = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const setNullAnchorEl = () => setAnchorEl(null);
  const handleClickLogout = () => {
    setNullAnchorEl();
    props.onClickLogout();
  };

  return (
    <div>
      <Button
        aria-controls="profile-menu"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClickProfileButton}
      >
        <Avatar
          aria-label="user profile avatar"
          alt="Avatar Icon"
          // src={user.photoURL}
          className={classes.avatar}
        />
      </Button>
      <ProfileMenu
        anchorEl={anchorEl}
        onClickLogout={handleClickLogout}
        onClose={setNullAnchorEl}
      />
    </div>
  );
};

const ProfileOrLogin: React.FC<ProfileOrLoginProps> = (props) => {
  const dispatch = useDispatch();
  if (props.user === null) {
    return <LoginButton />;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleClickLogout = async () => {
    dispatch(logout());
  };
  return <ProfileButton user={props.user} onClickLogout={handleClickLogout} />;
};

export const MyAppBar: React.FC<Props> = (props) => {
  const classes = useStyles(undefined);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, isDrawerOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer(true)}
            className={clsx(
              classes.menuButton,
              isDrawerOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <ProfileOrLogin user={props.user} />
        </Toolbar>
      </AppBar>
      <MyDrawer open={isDrawerOpen} onClose={handleDrawer(false)} />
    </div>
  );
};
