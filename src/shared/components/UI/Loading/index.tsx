import { motion } from "framer-motion";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  fullScreen?: boolean;
}

export function Loading({ 
  message = "Carregando...", 
  size = "md",
  variant = "spinner",
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const LoadingSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const LoadingDots = () => (
    <div className="flex gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-blue-600 rounded-full`}
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const LoadingPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-blue-600 rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const LoadingBars = () => (
    <div className="flex gap-1.5 items-end" style={{ height: sizeClasses[size].split(' ')[1] }}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`${size === 'sm' ? 'w-1.5' : size === 'md' ? 'w-2' : 'w-3'} bg-blue-600 rounded-full`}
          animate={{
            height: ["40%", "100%", "40%"]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <LoadingDots />;
      case "pulse":
        return <LoadingPulse />;
      case "bars":
        return <LoadingBars />;
      default:
        return <LoadingSpinner />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {renderLoader()}
      {message && (
        <motion.p
          className={`${textSizeClasses[size]} font-medium text-gray-700`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

// Exportar variantes específicas para uso direto
export const LoadingSpinner = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading {...props} variant="spinner" />
);

export const LoadingDots = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading {...props} variant="dots" />
);

export const LoadingPulse = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading {...props} variant="pulse" />
);

export const LoadingBars = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading {...props} variant="bars" />
);

// Loading inline para uso em botões
export function LoadingInline({ size = "sm" }: Pick<LoadingProps, 'size'>) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <motion.div
      className={`${sizeMap[size]} border-2 border-white/30 border-t-white rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Loading skeleton para listas
export function LoadingSkeleton({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 rounded-lg"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
          style={{
            width: index === lines - 1 ? "60%" : "100%"
          }}
        />
      ))}
    </div>
  );
}

// Loading para cards
export function LoadingCard({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="space-y-4">
            <motion.div
              className="h-6 bg-gray-200 rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-4 bg-gray-200 rounded w-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-4 bg-gray-200 rounded w-2/3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}