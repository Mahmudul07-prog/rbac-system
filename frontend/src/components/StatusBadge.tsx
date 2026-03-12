interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'banned';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-amber-100 text-amber-700',
    banned: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'active'
            ? 'bg-emerald-500'
            : status === 'suspended'
            ? 'bg-amber-500'
            : 'bg-red-500'
        }`}
      />
      {status}
    </span>
  );
}