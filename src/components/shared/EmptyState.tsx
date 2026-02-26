interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, subtitle, icon = '📋', action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {action}
    </div>
  );
}
