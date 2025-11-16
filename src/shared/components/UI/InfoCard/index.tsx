import type{ ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  description?: string;
  variant?: "blue" | "green" | "orange" | "purple";
}

const variantStyles = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    valueColor: "text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-green-900",
    valueColor: "text-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    titleColor: "text-orange-900",
    valueColor: "text-orange-700",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    titleColor: "text-purple-900",
    valueColor: "text-purple-700",
  },
};

export function InfoCard({
  icon,
  title,
  value,
  description,
  variant = "blue",
}: InfoCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div className={`${styles.iconBg} p-3 rounded-lg`}>
          <div className={`${styles.iconColor} w-6 h-6`}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.titleColor} mb-1`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${styles.valueColor}`}>{value}</p>
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}