import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
      const { theme = "system" } = useTheme();

      return (
            <Sonner
                  theme={theme}
                  position="top-center"
                  className="custom-toast"
                  toastOptions={{
                        className:
                              "border border-neutral-600 bg-[#1c1c1c] text-white text-sm rounded-md shadow-lg animate-toast-slide",
                  }}
                  {...props}
            />
      );
};

export { Toaster };
