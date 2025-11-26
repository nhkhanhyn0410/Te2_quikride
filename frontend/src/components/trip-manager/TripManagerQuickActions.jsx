import { Button, Card, Badge, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const TripManagerQuickActions = ({ 
  activeTrips = 0, 
  pendingIssues = 0, 
  emergencyAlerts = 0,
  className = '',
  isMobile = false 
}) => {
  const navigate = useNavigate();
  const { getIconByContext, createContextIcon } = useIcon();

  const quickActions = [
    {
      key: 'active-trips',
      title: 'Active Trips',
      count: activeTrips,
      icon: createContextIcon('transport', 'bus', { size: 'lg', color: 'primary' }),
      color: 'blue',
      path: '/trip-manager/trips/active',
      description: 'Monitor ongoing trips'
    },
    {
      key: 'emergency',
      title: 'Emergency Alerts',
      count: emergencyAlerts,
      icon: getIconByContext('status', 'warning'),
      color: 'red',
      path: '/trip-manager/emergency',
      description: 'Handle emergency situations',
      urgent: emergencyAlerts > 0
    },
    {
      key: 'issues',
      title: 'Pending Issues',
      count: pendingIssues,
      icon: createContextIcon('support', 'complaint', { size: 'lg', color: 'warning' }),
      color: 'orange',
      path: '/trip-manager/issues',
      description: 'Resolve trip issues'
    },
    {
      key: 'schedule',
      title: 'Schedule Management',
      icon: getIconByContext('time', 'calendar'),
      color: 'green',
      path: '/trip-manager/schedule',
      description: 'Manage trip schedules'
    },
    {
      key: 'drivers',
      title: 'Driver Status',
      icon: createContextIcon('transport', 'driver', { size: 'lg', color: 'primary' }),
      color: 'purple',
      path: '/trip-manager/drivers',
      description: 'Monitor driver availability'
    },
    {
      key: 'reports',
      title: 'Trip Reports',
      icon: getIconByContext('admin', 'reports'),
      color: 'indigo',
      path: '/trip-manager/reports',
      description: 'View trip analytics'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action.path);
  };

  return (
    <StandardPanel
      variant="default"
      size="medium"
      padding="comfortable"
      className={`${className}`}
      header={{
        title: 'Quick Actions',
        subtitle: 'Common trip management tasks',
        icon: getIconByContext('crud', 'create')
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Card
            key={action.key}
            hoverable
            className={`
              border-l-4 transition-all duration-200 cursor-pointer
              ${action.color === 'blue' ? 'border-l-blue-500 hover:bg-blue-50' : ''}
              ${action.color === 'red' ? 'border-l-red-500 hover:bg-red-50' : ''}
              ${action.color === 'orange' ? 'border-l-orange-500 hover:bg-orange-50' : ''}
              ${action.color === 'green' ? 'border-l-green-500 hover:bg-green-50' : ''}
              ${action.color === 'purple' ? 'border-l-purple-500 hover:bg-purple-50' : ''}
              ${action.color === 'indigo' ? 'border-l-indigo-500 hover:bg-indigo-50' : ''}
              ${action.urgent ? 'animate-pulse' : ''}
            `}
            onClick={() => handleActionClick(action)}
            bodyStyle={{ padding: '16px' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${action.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                  ${action.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                  ${action.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                  ${action.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                  ${action.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                  ${action.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : ''}
                `}>
                  {action.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 flex items-center space-x-2">
                    <span>{action.title}</span>
                    {action.count !== undefined && (
                      <Badge 
                        count={action.count} 
                        className={`
                          ${action.color === 'blue' ? 'bg-blue-500' : ''}
                          ${action.color === 'red' ? 'bg-red-500' : ''}
                          ${action.color === 'orange' ? 'bg-orange-500' : ''}
                          ${action.color === 'green' ? 'bg-green-500' : ''}
                          ${action.color === 'purple' ? 'bg-purple-500' : ''}
                          ${action.color === 'indigo' ? 'bg-indigo-500' : ''}
                        `}
                        showZero={true}
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {action.description}
                  </div>
                </div>
              </div>
              <div className="text-gray-400">
                {getIconByContext('navigation', 'forward')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Emergency Quick Actions */}
      {emergencyAlerts > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                {getIconByContext('status', 'warning')}
              </div>
              <div>
                <div className="font-semibold text-red-800">
                  Emergency Attention Required
                </div>
                <div className="text-sm text-red-600">
                  {emergencyAlerts} active emergency alert{emergencyAlerts > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <Button 
              type="primary" 
              danger
              icon={getIconByContext('status', 'warning')}
              onClick={() => navigate('/trip-manager/emergency')}
            >
              Handle Now
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Optimized Actions */}
      <div className="md:hidden mt-6">
        <div className="grid grid-cols-2 gap-2">
          <Tooltip title="Emergency Hotline">
            <Button 
              type="primary" 
              danger 
              block
              icon={getIconByContext('authentication', 'phone')}
              onClick={() => window.open('tel:911')}
              size="large"
            >
              Emergency
            </Button>
          </Tooltip>
          <Tooltip title="Quick Trip Update">
            <Button 
              type="primary" 
              block
              icon={getIconByContext('crud', 'update')}
              onClick={() => navigate('/trip-manager/quick-update')}
              size="large"
            >
              Quick Update
            </Button>
          </Tooltip>
        </div>
        
        {/* Mobile Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{activeTrips}</div>
            <div className="text-xs text-blue-600">Active</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{pendingIssues}</div>
            <div className="text-xs text-orange-600">Issues</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">{emergencyAlerts}</div>
            <div className="text-xs text-red-600">Alerts</div>
          </div>
        </div>
      </div>
    </StandardPanel>
  );
};

export default TripManagerQuickActions;