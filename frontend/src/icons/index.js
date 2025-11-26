/**
 * Icons module exports
 */

export { default as IconProvider, useIcon } from './IconProvider';
export { 
  antdIcons, 
  reactIcons, 
  iconContexts, 
  fallbackIcons, 
  iconSizes, 
  iconColors,
  default as iconMapping 
} from './iconMapping';
export {
  getIconComponent,
  iconExists,
  getIconNameByContext,
  getContextIcons,
  getAvailableContexts,
  getStandardizedIconProps,
  createIconClassName,
  validateIconConfig,
  getFallbackIcon,
  createMigrationMap,
  generateIconDocumentation,
  default as iconUtils
} from './iconUtils';

// Re-export everything for convenience
export * from './iconMapping';
export * from './iconUtils';