// CustomToaster.tsx
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";

export function CustomToaster() {
  const { theme } = useTheme();

  const getBaseToasterStyles = () => {
    const baseStyles = {
      borderRadius: "var(--rounded-box, 1rem)",
      padding: "1rem 1.5rem",
      border: "1px solid",
      transition: "all 0.2s ease-in-out",
    };

    if (theme === "garden") {
      return {
        ...baseStyles,
        background: "hsl(0 0% 98%)",
        color: "hsl(155 27% 20%)", // Darker green text for garden theme
        borderColor: "hsl(155 27% 85%)",
        boxShadow: "0 4px 6px -1px rgba(155, 187, 89, 0.1)",
      };
    } else if (theme === "sunset") {
      return {
        ...baseStyles,
        background: "hsl(14 100% 8%)", // Deep sunset background
        color: "hsl(39 100% 85%)", // Warm sunset text
        borderColor: "hsl(14 100% 15%)",
        boxShadow: "0 4px 6px -1px rgba(255, 87, 34, 0.2)",
      };
    }

    // Fallback to CSS variables for other themes
    return {
      ...baseStyles,
      background: "hsl(var(--b2))",
      color: "hsl(var(--bc))",
      borderColor: "hsl(var(--b3))",
      boxShadow: "var(--shadow-lg)",
    };
  };

  const getSuccessStyles = () => {
    const baseStyles = {
      borderRadius: "var(--rounded-box, 1rem)",
      padding: "1rem 1.5rem",
      border: "1px solid",
      transition: "all 0.2s ease-in-out",
    };

    if (theme === "garden") {
      return {
        ...baseStyles,
        background: "hsl(155 55% 92%)", // Light green background
        borderColor: "hsl(155 55% 75%)",
        color: "hsl(155 55% 25%)", // Dark green text
      };
    } else if (theme === "sunset") {
      return {
        ...baseStyles,
        background: "hsl(155 55% 15%)", // Dark green background
        borderColor: "hsl(155 55% 30%)",
        color: "hsl(155 55% 80%)", // Light green text
      };
    }

    // Fallback to CSS variables
    return {
      ...baseStyles,
      background: "hsl(var(--su) / 0.1)",
      borderColor: "hsl(var(--su) / 0.3)",
      color: "hsl(var(--su-content, var(--bc)))",
    };
  };

  const getErrorStyles = () => {
    const baseStyles = {
      borderRadius: "var(--rounded-box, 1rem)",
      padding: "1rem 1.5rem",
      border: "1px solid",
      transition: "all 0.2s ease-in-out",
    };

    if (theme === "garden") {
      return {
        ...baseStyles,
        background: "hsl(0 65% 92%)", // Light red background
        borderColor: "hsl(0 65% 75%)",
        color: "hsl(0 65% 30%)", // Dark red text
      };
    } else if (theme === "sunset") {
      return {
        ...baseStyles,
        background: "hsl(14 100% 15%)", // Deep sunset red
        borderColor: "hsl(14 100% 30%)",
        color: "hsl(14 100% 85%)", // Light orange text
      };
    }

    // Fallback to CSS variables
    return {
      ...baseStyles,
      background: "hsl(var(--er) / 0.1)",
      borderColor: "hsl(var(--er) / 0.3)",
      color: "hsl(var(--er-content, var(--bc)))",
    };
  };

  //   const getWarningStyles = () => {
  //     const baseStyles = {
  //       borderRadius: 'var(--rounded-box, 1rem)',
  //       padding: '1rem 1.5rem',
  //       border: '1px solid',
  //       transition: 'all 0.2s ease-in-out',
  //     };

  //     if (theme === 'garden') {
  //       return {
  //         ...baseStyles,
  //         background: 'hsl(45 85% 92%)', // Light yellow background
  //         borderColor: 'hsl(45 85% 75%)',
  //         color: 'hsl(45 85% 25%)', // Dark yellow text
  //       };
  //     } else if (theme === 'sunset') {
  //       return {
  //         ...baseStyles,
  //         background: 'hsl(39 100% 15%)', // Deep sunset yellow
  //         borderColor: 'hsl(39 100% 30%)',
  //         color: 'hsl(39 100% 85%)', // Light yellow text
  //       };
  //     }

  //     // Fallback to CSS variables
  //     return {
  //       ...baseStyles,
  //       background: 'hsl(var(--wa) / 0.1)',
  //       borderColor: 'hsl(var(--wa) / 0.3)',
  //       color: 'hsl(var(--wa-content, var(--bc)))',
  //     };
  //   };

  const getInfoStyles = () => {
    const baseStyles = {
      borderRadius: "var(--rounded-box, 1rem)",
      padding: "1rem 1.5rem",
      border: "1px solid",
      transition: "all 0.2s ease-in-out",
    };

    if (theme === "garden") {
      return {
        ...baseStyles,
        background: "hsl(200 75% 92%)", // Light blue background
        borderColor: "hsl(200 75% 75%)",
        color: "hsl(200 75% 25%)", // Dark blue text
      };
    } else if (theme === "sunset") {
      return {
        ...baseStyles,
        background: "hsl(200 75% 15%)", // Dark blue background
        borderColor: "hsl(200 75% 30%)",
        color: "hsl(200 75% 80%)", // Light blue text
      };
    }

    // Fallback to CSS variables
    return {
      ...baseStyles,
      background: "hsl(var(--in) / 0.1)",
      borderColor: "hsl(var(--in) / 0.3)",
      color: "hsl(var(--in-content, var(--bc)))",
    };
  };

  const getLoadingStyles = () => {
    // Loading toasts can use the same styles as info or base styles
    return getInfoStyles();
  };

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: getBaseToasterStyles(),
        success: {
          style: getSuccessStyles(),
          iconTheme: {
            primary:
              theme === "garden"
                ? "hsl(155 55% 35%)"
                : theme === "sunset"
                  ? "hsl(155 55% 70%)"
                  : "hsl(var(--su))",
            secondary:
              theme === "garden"
                ? "hsl(155 55% 92%)"
                : theme === "sunset"
                  ? "hsl(155 55% 15%)"
                  : "hsl(var(--su) / 0.1)",
          },
        },
        error: {
          style: getErrorStyles(),
          iconTheme: {
            primary:
              theme === "garden"
                ? "hsl(0 65% 40%)"
                : theme === "sunset"
                  ? "hsl(14 100% 75%)"
                  : "hsl(var(--er))",
            secondary:
              theme === "garden"
                ? "hsl(0 65% 92%)"
                : theme === "sunset"
                  ? "hsl(14 100% 15%)"
                  : "hsl(var(--er) / 0.1)",
          },
        },
        loading: {
          style: getLoadingStyles(),
          iconTheme: {
            primary:
              theme === "garden"
                ? "hsl(200 75% 35%)"
                : theme === "sunset"
                  ? "hsl(200 75% 70%)"
                  : "hsl(var(--in))",
            secondary:
              theme === "garden"
                ? "hsl(200 75% 92%)"
                : theme === "sunset"
                  ? "hsl(200 75% 15%)"
                  : "hsl(var(--in) / 0.1)",
          },
        },
        // Custom toast types - you can use these with toast.custom() or toast()
        blank: {
          style: getBaseToasterStyles(),
        },
      }}
      containerStyle={{
        top: "1rem",
      }}
      containerClassName=""
    />
  );
}

// Helper functions for custom toast usage with your styling
export const customToast = {
  success: (message: string) => {
    return toast.success(message);
  },
  error: (message: string) => {
    return toast.error(message);
  },
  warning: (message: string, theme?: string) => {
    return toast(() => (
      <div
        style={
          theme === "garden"
            ? {
                background: "hsl(45 85% 92%)",
                borderColor: "hsl(45 85% 75%)",
                color: "hsl(45 85% 25%)",
                borderRadius: "var(--rounded-box, 1rem)",
                padding: "1rem 1.5rem",
                border: "1px solid",
              }
            : theme === "sunset"
              ? {
                  background: "hsl(39 100% 15%)",
                  borderColor: "hsl(39 100% 30%)",
                  color: "hsl(39 100% 85%)",
                  borderRadius: "var(--rounded-box, 1rem)",
                  padding: "1rem 1.5rem",
                  border: "1px solid",
                }
              : {
                  background: "hsl(var(--wa) / 0.1)",
                  borderColor: "hsl(var(--wa) / 0.3)",
                  color: "hsl(var(--wa-content, var(--bc)))",
                  borderRadius: "var(--rounded-box, 1rem)",
                  padding: "1rem 1.5rem",
                  border: "1px solid",
                }
        }
      >
        ⚠️ {message}
      </div>
    ));
  },
  info: (message: string, theme?: string) => {
    return toast(() => (
      <div
        style={
          theme === "garden"
            ? {
                background: "hsl(200 75% 92%)",
                borderColor: "hsl(200 75% 75%)",
                color: "hsl(200 75% 25%)",
                borderRadius: "var(--rounded-box, 1rem)",
                padding: "1rem 1.5rem",
                border: "1px solid",
              }
            : theme === "sunset"
              ? {
                  background: "hsl(200 75% 15%)",
                  borderColor: "hsl(200 75% 30%)",
                  color: "hsl(200 75% 80%)",
                  borderRadius: "var(--rounded-box, 1rem)",
                  padding: "1rem 1.5rem",
                  border: "1px solid",
                }
              : {
                  background: "hsl(var(--in) / 0.1)",
                  borderColor: "hsl(var(--in) / 0.3)",
                  color: "hsl(var(--in-content, var(--bc)))",
                  borderRadius: "var(--rounded-box, 1rem)",
                  padding: "1rem 1.5rem",
                  border: "1px solid",
                }
        }
      >
        ℹ️ {message}
      </div>
    ));
  },
};
