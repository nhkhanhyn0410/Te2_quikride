/**
 * ResponsiveText Component
 * Provides responsive typography with consistent scaling
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getResponsiveTextSize, getResponsiveHeading } from '../../../utils/responsive';

const ResponsiveText = ({
  children,
  as: Component = 'p',
  size = 'base',
  heading = null,
  weight = 'normal',
  color = 'neutral-900',
  align = 'left',
  className = '',
  ...props
}) => {
  // Generate text classes
  const getTextClasses = () => {
    const classes = [];
    
    // Size handling
    if (heading) {
      classes.push(getResponsiveHeading(heading));
    } else {
      classes.push(getResponsiveTextSize(size));
    }
    
    // Weight handling
    const weightMap = {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    };
    
    if (weightMap[weight]) {
      classes.push(weightMap[weight]);
    }
    
    // Color handling
    if (color.includes('-')) {
      classes.push(`text-${color}`);
    } else {
      classes.push(`text-neutral-${color}`);
    }
    
    // Alignment handling
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };
    
    if (alignMap[align]) {
      classes.push(alignMap[align]);
    }
    
    return classes.join(' ');
  };

  const textClasses = `${getTextClasses()} ${className}`.trim();

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
};

ResponsiveText.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  size: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']),
  heading: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  weight: PropTypes.oneOf([
    'thin', 'extralight', 'light', 'normal', 'medium', 
    'semibold', 'bold', 'extrabold', 'black'
  ]),
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  className: PropTypes.string,
};

export default ResponsiveText;