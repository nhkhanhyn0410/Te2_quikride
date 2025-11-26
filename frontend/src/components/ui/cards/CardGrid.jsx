/**
 * CardGrid Component
 * Responsive grid layout for cards with consistent spacing
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import classNames from 'classnames';

const CardGrid = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gutter = [16, 16],
  align = 'top',
  justify = 'start',
  className,
  ...props
}) => {
  const gridClassName = classNames(
    'card-grid',
    className
  );

  // Calculate responsive column spans
  const getColSpan = () => {
    const spans = {};
    
    if (typeof columns === 'number') {
      // If columns is a number, use it for all breakpoints
      const span = 24 / columns;
      return { span };
    }

    // Handle responsive columns object
    Object.entries(columns).forEach(([breakpoint, cols]) => {
      spans[breakpoint] = 24 / cols;
    });

    return spans;
  };

  const colSpan = getColSpan();

  return (
    <Row
      gutter={gutter}
      align={align}
      justify={justify}
      className={gridClassName}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <Col key={index} {...colSpan}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      xs: PropTypes.number,
      sm: PropTypes.number,
      md: PropTypes.number,
      lg: PropTypes.number,
      xl: PropTypes.number,
      xxl: PropTypes.number,
    }),
  ]),
  gutter: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  align: PropTypes.oneOf(['top', 'middle', 'bottom', 'stretch']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly']),
  className: PropTypes.string,
};

export default CardGrid;