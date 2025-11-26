/**
 * Empty State Components
 * Standardized empty state indicators for different content types
 */

import React from 'react';
import { Empty, Button } from 'antd';
import { 
  FileTextOutlined, 
  TableOutlined, 
  BarChartOutlined, 
  UserOutlined,
  SearchOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Standard Empty State
 * Basic empty state with customizable content
 */
export const EmptyState = ({
  image,
  title = 'No data available',
  description,
  action,
  className,
  ...props
}) => {
  const emptyClassName = classNames(
    'flex',
    'items-center',
    'justify-center',
    'py-12',
    className
  );

  return (
    <div className={emptyClassName} {...props}>
      <Empty
        image={image}
        description={
          <div className="space-y-2">
            <div className="text-neutral-600 font-medium">{title}</div>
            {description && (
              <div className="text-neutral-500 text-sm">{description}</div>
            )}
          </div>
        }
      >
        {action}
      </Empty>
    </div>
  );
};

EmptyState.propTypes = {
  image: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

/**
 * No Data Empty State
 * Empty state for when there's no data to display
 */
export const NoDataEmpty = ({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  onRefresh,
  className,
  ...props
}) => {
  return (
    <EmptyState
      image={<FileTextOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={
        onRefresh && (
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )
      }
      className={className}
      {...props}
    />
  );
};

NoDataEmpty.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onRefresh: PropTypes.func,
  className: PropTypes.string,
};

/**
 * No Results Empty State
 * Empty state for search results or filtered data
 */
export const NoResultsEmpty = ({
  title = 'No results found',
  description = 'Try adjusting your search or filter criteria.',
  onClear,
  className,
  ...props
}) => {
  return (
    <EmptyState
      image={<SearchOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={
        onClear && (
          <Button onClick={onClear}>
            Clear filters
          </Button>
        )
      }
      className={className}
      {...props}
    />
  );
};

NoResultsEmpty.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClear: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Empty Table State
 * Empty state specifically for tables
 */
export const EmptyTable = ({
  title = 'No records found',
  description = 'There are no records to display in this table.',
  onCreate,
  onRefresh,
  className,
  ...props
}) => {
  const actions = [];
  
  if (onCreate) {
    actions.push(
      <Button key="create" type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        Add new record
      </Button>
    );
  }
  
  if (onRefresh) {
    actions.push(
      <Button key="refresh" icon={<ReloadOutlined />} onClick={onRefresh}>
        Refresh
      </Button>
    );
  }

  return (
    <EmptyState
      image={<TableOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={actions.length > 0 && <div className="space-x-2">{actions}</div>}
      className={className}
      {...props}
    />
  );
};

EmptyTable.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onCreate: PropTypes.func,
  onRefresh: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Empty Chart State
 * Empty state for charts and data visualizations
 */
export const EmptyChart = ({
  title = 'No data to display',
  description = 'There is no data available for this chart.',
  onRefresh,
  className,
  ...props
}) => {
  return (
    <EmptyState
      image={<BarChartOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={
        onRefresh && (
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Refresh data
          </Button>
        )
      }
      className={className}
      {...props}
    />
  );
};

EmptyChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onRefresh: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Empty List State
 * Empty state for lists and collections
 */
export const EmptyList = ({
  title = 'No items found',
  description = 'This list is currently empty.',
  onCreate,
  className,
  ...props
}) => {
  return (
    <EmptyState
      image={<InboxOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={
        onCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Add first item
          </Button>
        )
      }
      className={className}
      {...props}
    />
  );
};

EmptyList.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onCreate: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Empty User State
 * Empty state for user-related content
 */
export const EmptyUser = ({
  title = 'No users found',
  description = 'There are no users to display.',
  onInvite,
  className,
  ...props
}) => {
  return (
    <EmptyState
      image={<UserOutlined className="text-4xl text-neutral-400" />}
      title={title}
      description={description}
      action={
        onInvite && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onInvite}>
            Invite users
          </Button>
        )
      }
      className={className}
      {...props}
    />
  );
};

EmptyUser.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onInvite: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Custom Empty State
 * Fully customizable empty state
 */
export const CustomEmpty = ({
  icon,
  title,
  description,
  actions = [],
  size = 'default',
  className,
  ...props
}) => {
  const sizeConfig = {
    small: {
      iconSize: 'text-2xl',
      titleSize: 'text-sm',
      descriptionSize: 'text-xs',
      padding: 'py-8',
    },
    default: {
      iconSize: 'text-4xl',
      titleSize: 'text-base',
      descriptionSize: 'text-sm',
      padding: 'py-12',
    },
    large: {
      iconSize: 'text-6xl',
      titleSize: 'text-lg',
      descriptionSize: 'text-base',
      padding: 'py-16',
    },
  };

  const config = sizeConfig[size];

  const emptyClassName = classNames(
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'text-center',
    'space-y-4',
    config.padding,
    className
  );

  return (
    <div className={emptyClassName} {...props}>
      {icon && (
        <div className={classNames(config.iconSize, 'text-neutral-400')}>
          {icon}
        </div>
      )}
      
      {title && (
        <div className={classNames(config.titleSize, 'font-medium', 'text-neutral-600')}>
          {title}
        </div>
      )}
      
      {description && (
        <div className={classNames(config.descriptionSize, 'text-neutral-500', 'max-w-md')}>
          {description}
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </div>
  );
};

CustomEmpty.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

export default {
  EmptyState,
  NoDataEmpty,
  NoResultsEmpty,
  EmptyTable,
  EmptyChart,
  EmptyList,
  EmptyUser,
  CustomEmpty,
};