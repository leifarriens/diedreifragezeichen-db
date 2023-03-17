import { Toaster } from 'react-hot-toast';

import { colors } from '@/constants/theme';

function CustomToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          padding: '1em',
          borderRadius: '8px',
          boxShadow: '0 0 20px 5px rgba(0, 0, 0, 0.15)',
          backgroundColor: colors.lightblue,
          color: colors.white,
          maxWidth: '90%',
        },
        success: {
          style: {
            backgroundColor: colors.green,
          },
        },
        error: {
          style: {
            backgroundColor: colors.red,
          },
        },
      }}
    />
  );
}

export { CustomToaster as Toaster };
