// client/src/components/ConfirmationDialog.tsx
import React from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogContentText,
 DialogActions,
 Button,
} from '@mui/material';
import { useTheme } from "@mui/material/styles"

interface ConfirmationDialogProps {
 open: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 content: string;
 confirmText?: string;
 cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
 open,
 onClose,
 onConfirm,
 title,
 content,
 confirmText = 'Confirm',
 cancelText = 'Cancel',
}) => {
  const theme = useTheme();

 return (
   <Dialog
     open={open}
     onClose={onClose}
     aria-labelledby="alert-dialog-title"
     aria-describedby="alert-dialog-description"
   >
     <DialogTitle id="alert-dialog-title" sx={{backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText,}}>{title}</DialogTitle>
     <DialogContent>
       <DialogContentText id="alert-dialog-description">
         {content}
       </DialogContentText>
     </DialogContent>
     <DialogActions>
       <Button onClick={onClose} variant='contained' color="primary">
         {cancelText}
       </Button>
       <Button onClick={onConfirm} color="primary" variant='contained' autoFocus>
         {confirmText}
       </Button>
     </DialogActions>
   </Dialog>
 );
};

export default ConfirmationDialog;