import { useEffect } from 'react';
import { toast } from 'sonner';

export function useDisableContextMenuAndCopy() {
      useEffect(() => {
            const handleContextMenu = (e) => {
                  e.preventDefault();
                  toast("⚠️ Content is protected!!", {
                        description: "Right-click is disabled on this website.",
                  });
            };

            const handleCopy = (e) => {
                  e.preventDefault();
                  toast("⚠️ Copying is disabled!", {
                        description: "This content cannot be copied.",
                  });
            };

            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('copy', handleCopy);

            return () => {
                  document.removeEventListener('contextmenu', handleContextMenu);
                  document.removeEventListener('copy', handleCopy);
            };
      }, []);
}
