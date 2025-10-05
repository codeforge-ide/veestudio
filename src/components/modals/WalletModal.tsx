'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardActionArea,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isConnecting: boolean;
  error?: string;
}

export default function WalletModal({ 
  open, 
  onClose, 
  onConnect, 
  isConnecting,
  error 
}: WalletModalProps) {
  const wallets = [
    {
      id: 'veworld',
      name: 'VeWorld',
      description: 'Official VeChain Wallet',
      icon: '/veestudio.png',
      recommended: true,
    },
    {
      id: 'sync2',
      name: 'Sync2',
      description: 'Coming Soon',
      icon: '/veestudio.png',
      recommended: false,
      disabled: true,
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <AccountBalanceWalletIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Connect Wallet
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={isConnecting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Choose a wallet to connect to VeeStudio. Your wallet will be used to sign transactions.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              variant="outlined"
              sx={{
                opacity: wallet.disabled ? 0.5 : 1,
                cursor: wallet.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <CardActionArea
                onClick={() => !wallet.disabled && !isConnecting && onConnect()}
                disabled={wallet.disabled || isConnecting}
                sx={{ p: 2.5 }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <Image 
                      src={wallet.icon} 
                      alt={wallet.name}
                      width={32}
                      height={32}
                    />
                  </Box>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {wallet.name}
                      </Typography>
                      {wallet.recommended && (
                        <Chip 
                          label="Recommended" 
                          size="small" 
                          color="primary" 
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {wallet.description}
                    </Typography>
                  </Box>
                  {isConnecting && wallet.id === 'veworld' && (
                    <CircularProgress size={24} />
                  )}
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Make sure you have VeWorld extension installed in your browser.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={isConnecting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
