import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './StandardTable.css';

/**
 * StandardTable Component
 * 
 * A standardized table component that extends Ant Design Table with consistent styling,
 * responsive behavior, and standardized action patterns.
 * 
 * Features:
 * - Consistent row hover effects and selection styling
 * - Standardized pagination with configurable page sizes
 * - Responsive behavior with horizontal scrolling
 * - Column priority system for mobile displays
 * - Standardized action button placement and styling
 */
const StandardTable = ({
  columns = [],
  dataSource = [],
  loading = false,
  pagination = true,
  size = 'middle',
  variant = 'default',
  showActions = false,
  actionColumn = {},
  responsive = true,
  stickyHeader = false,
  className = '',
  onView,
  onEdit,
  onDelete,
  onCustomAction,
  ...props
}) => {
  // Default pagination configuration
  const defaultPagination = {
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `${range[0]}-${range[1]} của ${total} mục`,
    size: 'default',
  };

  // Merge pagination configuration
  const paginationConfig = pagination === true 
    ? defaultPagination 
    : pagination === false 
      ? false 
      : { ...defaultPagination, ...pagination };

  // Create standardized action column
  const createActionColumn = () => {
    if (!showActions) return null;

    const defaultActionColumn = {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
                className="standard-table-action-btn"
              />
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                className="standard-table-action-btn standard-table-action-edit"
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
                className="standard-table-action-btn standard-table-action-delete"
                danger
              />
            </Tooltip>
          )}
          {onCustomAction && (
            <Tooltip title="Thêm thao tác">
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                onClick={() => onCustomAction(record)}
                className="standard-table-action-btn"
              />
            </Tooltip>
          )}
        </Space>
      ),
    };

    return { ...defaultActionColumn, ...actionColumn };
  };

  // Process columns with responsive priorities
  const processColumns = () => {
    let processedColumns = [...columns];

    // Add responsive priorities if not specified
    processedColumns = processedColumns.map((col, index) => ({
      priority: index < 2 ? 1 : 2, // First 2 columns have high priority
      ...col,
      className: `${col.className || ''} standard-table-column`,
    }));

    // Add action column if needed
    const actionCol = createActionColumn();
    if (actionCol) {
      processedColumns.push(actionCol);
    }

    return processedColumns;
  };

  // Generate table class names
  const getTableClassName = () => {
    const baseClass = 'standard-table';
    const variantClass = `standard-table--${variant}`;
    const sizeClass = `standard-table--${size}`;
    const responsiveClass = responsive ? 'standard-table--responsive' : '';
    const stickyClass = stickyHeader ? 'standard-table--sticky' : '';
    
    return [
      baseClass,
      variantClass,
      sizeClass,
      responsiveClass,
      stickyClass,
      className
    ].filter(Boolean).join(' ');
  };

  // Scroll configuration for responsive behavior
  const scrollConfig = responsive ? {
    x: 'max-content',
    y: stickyHeader ? 400 : undefined,
  } : undefined;

  return (
    <div className={getTableClassName()}>
      <Table
        columns={processColumns()}
        dataSource={dataSource}
        loading={loading}
        pagination={paginationConfig}
        size={size}
        scroll={scrollConfig}
        sticky={stickyHeader}
        rowClassName={(record, index) => 
          `standard-table-row ${index % 2 === 0 ? 'standard-table-row--even' : 'standard-table-row--odd'}`
        }
        {...props}
      />
    </div>
  );
};

StandardTable.propTypes = {
  /** Table columns configuration */
  columns: PropTypes.array,
  /** Table data source */
  dataSource: PropTypes.array,
  /** Loading state */
  loading: PropTypes.bool,
  /** Pagination configuration or false to disable */
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Table size */
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  /** Table variant for different styling */
  variant: PropTypes.oneOf(['default', 'bordered', 'striped']),
  /** Show standardized action column */
  showActions: PropTypes.bool,
  /** Action column configuration */
  actionColumn: PropTypes.object,
  /** Enable responsive behavior */
  responsive: PropTypes.bool,
  /** Enable sticky header */
  stickyHeader: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
  /** View action handler */
  onView: PropTypes.func,
  /** Edit action handler */
  onEdit: PropTypes.func,
  /** Delete action handler */
  onDelete: PropTypes.func,
  /** Custom action handler */
  onCustomAction: PropTypes.func,
};

export default StandardTable;