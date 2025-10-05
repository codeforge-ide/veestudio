'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Image from 'next/image';
import { WalletState } from '@/types';
import { truncateAddress } from '@/lib/vechain';
import WalletModal from '@/components/modals/WalletModal';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export default function Header({ 
  wallet, 
  onConnect, 
  onDisconnect,
  onDeploy, 
  isDeploying 
}: HeaderProps) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleConnectClick = () => {
    setWalletModalOpen(true);
    setConnectionError(undefined);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setConnectionError(undefined);
    try {
      await onConnect();
      setWalletModalOpen(false);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
    }
    handleMenuClose();
  };

  const handleDisconnect = () => {
    onDisconnect();
    handleMenuClose();
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 3 }}>
          {/* Logo and Title */}
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <Box
              sx={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Image 
                src="/veestudio.png" 
                alt="VeeStudio" 
                width={28} 
                height={28}
              />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                VeeStudio
              </Typography>
              <Typography variant="caption" color="text.secondary">
                VeChain IDE
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Network Badge */}
            {wallet.connected && wallet.network && (
              <Chip
                label={`${wallet.network}net`.toUpperCase()}
                size="small"
                color="success"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}

            {/* Wallet Button */}
            {wallet.connected ? (
              <Button
                variant="outlined"
                startIcon={<Avatar sx={{ width: 20, height: 20 }} />}
                onClick={handleMenuOpen}
                sx={{ textTransform: 'none' }}
              >
                <Typography variant="body2" fontFamily="monospace">
                  {truncateAddress(wallet.address || '')}
                </Typography>
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={handleConnectClick}
              >
                Connect Wallet
              </Button>
            )}

            {/* Deploy Button */}
            <Button
              variant="contained"
              startIcon={<RocketLaunchIcon />}
              onClick={onDeploy}
              disabled={isDeploying || !wallet.connected}
              sx={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3A7AC2 0%, #7B4CE6 100%)',
                },
              }}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Wallet Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 240, mt: 1 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Connected Address
          </Typography>
          <Typography variant="body2" fontFamily="monospace" sx={{ mt: 0.5 }}>
            {wallet.address}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleCopyAddress}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1.5 }} />
          Copy Address
        </MenuItem>
        <MenuItem onClick={handleDisconnect}>
          <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
          Disconnect
        </MenuItem>
      </Menu>

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnect}
        isConnecting={isConnecting}
        error={connectionError}
      />
    </>
  );
}
