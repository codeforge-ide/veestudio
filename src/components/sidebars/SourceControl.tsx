'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { OAuthProvider } from 'appwrite';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/contexts/AuthContext';

interface GitHubUser {
  $id: string;
  name: string;
  email?: string;
  prefs?: {
    githubUsername?: string;
    githubAvatar?: string;
  };
}

export default function SourceControl() {
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkGitHubAuth();
  }, [isAuthenticated]);

  const checkGitHubAuth = async () => {
    try {
      const user = await account.get() as unknown as GitHubUser;
      setGithubUser(user);
    } catch {
      setGithubUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setAuthenticating(true);
    try {
      const success = `${window.location.origin}/`;
      const failure = `${window.location.origin}/?error=github_auth_failed`;
      
      await account.createOAuth2Session(
        OAuthProvider.Github,
        success,
        failure
      );
    } catch (error) {
      console.error('GitHub auth error:', error);
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setGithubUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Source Control
      </Typography>

      {githubUser ? (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={githubUser.prefs?.githubAvatar}
              sx={{ width: 48, height: 48 }}
            >
              {githubUser.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {githubUser.name}
              </Typography>
              {githubUser.email && (
                <Typography variant="body2" color="text.secondary">
                  {githubUser.email}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Status */}
          <Chip 
            icon={<CheckCircleIcon />}
            label="Connected to GitHub"
            color="success"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />

          <Divider />

          {/* Repository Info */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Recent Activity
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="No commits yet"
                  secondary="Start coding to see your changes here"
                />
              </ListItem>
            </List>
          </Box>

          {/* Actions */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Disconnect GitHub
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', textAlign: 'center' }}>
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              backgroundColor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <GitHubIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Connect to GitHub
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Authenticate with GitHub to enable source control features, sync your code, and manage repositories.
            </Typography>
          </Box>

          <Alert severity="info" sx={{ width: '100%' }}>
            <Typography variant="body2">
              You&apos;ll be redirected to GitHub to authorize VeeStudio. Your code will remain secure.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={authenticating ? <CircularProgress size={20} /> : <GitHubIcon />}
            onClick={handleGitHubLogin}
            disabled={authenticating}
            sx={{ 
              mt: 2,
              backgroundColor: '#24292e',
              '&:hover': {
                backgroundColor: '#1b1f23',
              }
            }}
          >
            {authenticating ? 'Authenticating...' : 'Sign in with GitHub'}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            By connecting, you agree to grant VeeStudio access to your public repositories
          </Typography>
        </Box>
      )}
    </Box>
  );
}
