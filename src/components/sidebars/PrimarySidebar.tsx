'use client';

import React from 'react';
import { Box, IconButton, Typography, Button, Alert, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';
import { SidebarView } from '@/types';
import SourceControl from './SourceControl';

interface PrimarySidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onCompile: () => void;
  onDeploy: () => void;
}

export default function PrimarySidebar({ 
  activeView, 
  onViewChange, 
  onCompile,
  onDeploy 
}: PrimarySidebarProps) {
  const menuItems = [
    { id: 'files' as SidebarView, icon: FolderIcon, label: 'Files', color: 'primary' },
    { id: 'source-control' as SidebarView, icon: GitHubIcon, label: 'Source Control', color: 'inherit' },
    { id: 'compile' as SidebarView, icon: PlayArrowIcon, label: 'Compile', color: 'success' },
    { id: 'deploy' as SidebarView, icon: RocketLaunchIcon, label: 'Deploy', color: 'secondary' },
  ];

  return (
    <Box display="flex" height="100%">
      {/* STAGE 1: Icon-Only Fixed Bar (64px) - Like VSCode Activity Bar */}
      <Box
        sx={{
          width: 64,
          backgroundColor: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          py: 1,
          flexShrink: 0,
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Tooltip key={item.id} title={item.label} placement="right">
              <IconButton
                onClick={() => onViewChange(item.id)}
                sx={{
                  width: '100%',
                  borderRadius: 0,
                  py: 2,
                  borderLeft: isActive ? 2 : 0,
                  borderColor: 'primary.main',
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Icon 
                  color={isActive ? (item.color as 'primary' | 'success' | 'secondary' | 'inherit') : 'action'}
                  sx={{ fontSize: 24 }}
                />
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>

      {/* STAGE 2: Content Panel (Adjustable 288px) - Like VSCode Sidebar */}
      <Box
        sx={{
          width: 288,
          backgroundColor: 'rgba(17, 17, 17, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Content Header */}
        <Box 
          sx={{ 
            height: 64,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {menuItems.find(item => item.id === activeView)?.label}
          </Typography>
        </Box>

        {/* Content Area - Changes based on active tab */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {activeView === 'files' && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 1.5,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <FolderIcon fontSize="small" color="primary" />
                <Typography variant="body2">HelloWorld.sol</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
                File management coming soon. Currently editing the main contract file.
              </Typography>
            </Box>
          )}

          {activeView === 'source-control' && (
            <SourceControl />
          )}

          {activeView === 'compile' && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                Compile your Solidity contract to check for errors and generate bytecode for deployment.
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                onClick={onCompile}
                fullWidth
                size="large"
              >
                Compile Contract
              </Button>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="caption">
                  �� Compile your contract before deploying to catch any errors early.
                </Typography>
              </Alert>
            </Box>
          )}

          {activeView === 'deploy' && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                Deploy your compiled contract to VeChain TestNet with sponsored gas fees.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<RocketLaunchIcon />}
                onClick={onDeploy}
                fullWidth
                size="large"
              >
                Deploy Contract
              </Button>
              <Alert severity="success" sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  ✨ Gas fees sponsored!
                </Typography>
                <Typography variant="caption">
                  Deploy your contract for free with VeeStudio&apos;s fee delegation.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
