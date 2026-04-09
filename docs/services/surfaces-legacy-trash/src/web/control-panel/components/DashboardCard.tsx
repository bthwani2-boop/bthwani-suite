import Link from 'next/link';

interface Hub {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

interface DashboardCardProps {
  hub: Hub;
}

export function DashboardCard({ hub }: DashboardCardProps) {
  return (
    <Link href={hub.path} className="block">
      <div className="dashboard-card group cursor-pointer">
        <div className="dashboard-card-header">
          <div className={`w-12 h-12 ${hub.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
            {hub.icon}
          </div>
          <div className="text-right">
            <h3 className="dashboard-card-title group-hover:text-blue-600 transition-colors">
              {hub.title}
            </h3>
            <p className="dashboard-card-description">
              {hub.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            HUB: {hub.id.toUpperCase()}
          </span>
          <div className="text-blue-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200">
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
