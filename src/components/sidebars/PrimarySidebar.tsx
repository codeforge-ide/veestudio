'use client';

import React, { useState } from 'react';
import { Box, IconButton, Typography, Button, Alert, Tooltip, Divider } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'files' as SidebarView, icon: FolderIcon, label: 'Files', color: 'primary' },
    { id: 'source-control' as SidebarView, icon: GitHubIcon, label: 'Source Control', color: 'inherit' },
    { id: 'compile' as SidebarView, icon: PlayArrowIcon, label: 'Compile', color: 'success' },
    { id: 'deploy' as SidebarView, icon: RocketLaunchIcon, label: 'Deploy', color: 'secondary' },
  ];

  return (
    <Box 
      sx={{ 
        height: '100%', 
        backgroundColor: 'rgba(17, 17, 17, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRight: 1, 
        borderColor: 'divider',
        transition: 'width 0.3s',
        width: isExpanded ? 288 : 64,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          height: 64, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        {isExpanded && (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Explorer
          </Typography>
        )}
        <Tooltip title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
          <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronRightIcon 
              sx={{ 
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }} 
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Menu Items */}
      <Box sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Tooltip key={item.id} title={!isExpanded ? item.label : ''} placement="right">
              <Button
                onClick={() => onViewChange(item.id)}
                fullWidth
                sx={{
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  px: 2,
                  py: 1.5,
                  borderRadius: 0,
                  borderLeft: isActive ? 2 : 0,
                  borderColor: 'primary.main',
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Icon 
                  color={isActive ? item.color as any : 'action'}
                  sx={{ fontSize: 20 }}
                />
                {isExpanded && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1.5,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Button>
            </Tooltip>
          );
        })}
      </Box>

      {/* Content Area */}
      {isExpanded && (
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 3 }}>
          {activeView === 'files' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Compile your Solidity contract to check for errors and generate bytecode for deployment.
              </Typography>
              <Button
                variant="outlined"
                color="success"
                startIcon={<PlayArrowIcon />}
                onClick={onCompile}
                fullWidth
                sx={{ mt: 1 }}
              >
                Compile Contract
              </Button>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  💡 Tip: Compile your contract before deploying to catch any errors early.
                </Typography>
              </Alert>
            </Box>
          )}

          {activeView === 'deploy' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Deploy your compiled contract to VeChain TestNet with sponsored gas fees.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RocketLaunchIcon />}
                onClick={onDeploy}
                fullWidth
                sx={{ mt: 1 }}
              >
                Deploy Contract
              </Button>
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                  ✨ Gas fees sponsored!
                </Typography>
                <Typography variant="caption">
                  Deploy your contract for free with VeeStudio&apos;s fee delegation.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
