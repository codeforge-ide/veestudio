'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Avatar, Chip, Divider, List, ListItem, ListItemText,
  Alert, CircularProgress, TextField, IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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

interface ChangedFile {
  name: string;
  status: 'modified' | 'new' | 'deleted';
}

export default function SourceControl() {
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [changedFiles, setChangedFiles] = useState<ChangedFile[]>([
    { name: 'HelloWorld.sol', status: 'modified' },
    { name: 'new-feature.sol', status: 'new' },
  ]);
  const [stagedFiles, setStagedFiles] = useState<ChangedFile[]>([]);
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

  const handleStageFile = (file: ChangedFile) => {
    setChangedFiles(changedFiles.filter(f => f.name !== file.name));
    setStagedFiles([...stagedFiles, file]);
  };

  const handleUnstageFile = (file: ChangedFile) => {
    setStagedFiles(stagedFiles.filter(f => f.name !== file.name));
    setChangedFiles([...changedFiles, file]);
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message.');
      return;
    }
    // Mock commit action
    alert(`Committed ${stagedFiles.length} files with message: "${commitMessage}"`);
    setStagedFiles([]);
    setCommitMessage('');
  };

  const handleGitHubLogin = async () => {
    setAuthenticating(true);
    try {
      const success = `${window.location.origin}/`;
      const failure = `${window.location.origin}/?error=github_auth_failed`;
      await account.createOAuth2Session(OAuthProvider.Github, success, failure);
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
    return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {githubUser ? (
        <>
          <TextField
            fullWidth
            label="Commit Message"
            variant="outlined"
            size="small"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleCommit}
            disabled={stagedFiles.length === 0}
          >
            Commit & Push
          </Button>
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>Staged Changes</Typography>
          <List dense>
            {stagedFiles.map(file => (
              <ListItem key={file.name} secondaryAction={
                <IconButton edge="end" onClick={() => handleUnstageFile(file)}>
                  <RemoveIcon />
                </IconButton>
              }>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" gutterBottom>Changes</Typography>
          <List dense>
            {changedFiles.map(file => (
              <ListItem key={file.name} secondaryAction={
                <IconButton edge="end" onClick={() => handleStageFile(file)}>
                  <AddIcon />
                </IconButton>
              }>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 'auto' }}>
            <Button fullWidth variant="outlined" color="error" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Disconnect GitHub
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <GitHubIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Connect to GitHub</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Authenticate to sync your code and manage repositories.
          </Typography>
          <Button
            variant="contained"
            startIcon={authenticating ? <CircularProgress size={20} /> : <GitHubIcon />}
            onClick={handleGitHubLogin}
            disabled={authenticating}
          >
            {authenticating ? 'Authenticating...' : 'Sign in with GitHub'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
