/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { 
  antdIcons, 
  reactIcons, 
  iconContexts, 
  fallbackIcons, 
  iconSizes, 
  iconColors 
} from '../iconMapping';

describe('Icon Mapping', () => {
  describe('Ant Design Icons', () => {
    it('should have all required UI action icons', () => {
      const requiredIcons = [
        'search', 'add', 'edit', 'delete', 'save', 'close',
        'user', 'login', 'logout', 'settings',
        'mail', 'phone', 'lock',
        'success', 'error', 'warning', 'info', 'loading'
      ];

      requiredIcons.forEach(iconKey => {
        expect(antdIcons).toHaveProperty(iconKey);
        expect(typeof antdIcons[iconKey]).toBe('string');
        expect(antdIcons[iconKey]).toMatch(/Outlined$|Filled$/);
      });
    });

    it('should have consistent naming convention', () => {
      Object.values(antdIcons).forEach(iconName => {
        expect(typeof iconName).toBe('string');
        expect(iconName).toMatch(/^[A-Z][a-zA-Z]*(?:Outlined|Filled)$/);
      });
    });

    it('should have filled variants for important states', () => {
      expect(antdIcons.successFilled).toBe('CheckCircleFilled');
      expect(antdIcons.errorFilled).toBe('CloseCircleFilled');
      expect(antdIcons.warningFilled).toBe('ExclamationCircleFilled');
      expect(antdIcons.infoFilled).toBe('InfoCircleFilled');
    });
  });

  describe('React Icons', () => {
    it('should have all required decorative icons', () => {
      const requiredIcons = ['bus', 'userTie', 'ticket', 'smile', 'reportProblem'];

      requiredIcons.forEach(iconKey => {
        expect(reactIcons).toHaveProperty(iconKey);
        expect(reactIcons[iconKey]).toHaveProperty('library');
        expect(reactIcons[iconKey]).toHaveProperty('icon');
        expect(reactIcons[iconKey]).toHaveProperty('usage');
        expect(reactIcons[iconKey].usage).toBe('decorative');
      });
    });

    it('should have valid library references', () => {
      const validLibraries = ['fa', 'md', 'io'];

      Object.values(reactIcons).forEach(iconConfig => {
        expect(validLibraries).toContain(iconConfig.library);
        expect(typeof iconConfig.icon).toBe('string');
        expect(iconConfig.icon).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
      });
    });

    it('should have QuikRide domain-specific icons', () => {
      expect(reactIcons.bus.library).toBe('fa');
      expect(reactIcons.bus.icon).toBe('FaBus');
      expect(reactIcons.userTie.library).toBe('fa');
      expect(reactIcons.userTie.icon).toBe('FaUserTie');
      expect(reactIcons.ticket.library).toBe('fa');
      expect(reactIcons.ticket.icon).toBe('FaTicketAlt');
    });
  });

  describe('Icon Contexts', () => {
    it('should have all required contexts', () => {
      const requiredContexts = [
        'authentication', 'crud', 'navigation', 'status', 
        'transport', 'support', 'admin', 'time', 'payment'
      ];

      requiredContexts.forEach(context => {
        expect(iconContexts).toHaveProperty(context);
        expect(typeof iconContexts[context]).toBe('object');
      });
    });

    it('should have authentication context with all required actions', () => {
      const authActions = ['login', 'logout', 'register', 'profile', 'email', 'password'];
      
      authActions.forEach(action => {
        expect(iconContexts.authentication).toHaveProperty(action);
      });
    });

    it('should have CRUD context with all required actions', () => {
      const crudActions = ['create', 'read', 'update', 'delete', 'save', 'cancel'];
      
      crudActions.forEach(action => {
        expect(iconContexts.crud).toHaveProperty(action);
      });
    });

    it('should have transport context with domain-specific icons', () => {
      expect(iconContexts.transport).toHaveProperty('bus');
      expect(iconContexts.transport).toHaveProperty('driver');
      expect(iconContexts.transport).toHaveProperty('ticket');
      
      expect(iconContexts.transport.bus).toBe(reactIcons.bus);
      expect(iconContexts.transport.driver).toBe(reactIcons.userTie);
      expect(iconContexts.transport.ticket).toBe(reactIcons.ticket);
    });

    it('should reference valid icon configurations', () => {
      Object.values(iconContexts).forEach(context => {
        Object.values(context).forEach(iconConfig => {
          if (typeof iconConfig === 'string') {
            // Should be a valid antd icon
            expect(Object.values(antdIcons)).toContain(iconConfig);
          } else if (typeof iconConfig === 'object') {
            // Should be a valid react icon
            expect(iconConfig).toHaveProperty('library');
            expect(iconConfig).toHaveProperty('icon');
            expect(iconConfig).toHaveProperty('usage');
          }
        });
      });
    });
  });

  describe('Fallback Icons', () => {
    it('should have primary and decorative fallbacks', () => {
      expect(fallbackIcons).toHaveProperty('primary');
      expect(fallbackIcons).toHaveProperty('decorative');
    });

    it('should reference valid icons', () => {
      expect(Object.values(antdIcons)).toContain(fallbackIcons.primary);
      expect(Object.values(reactIcons)).toContain(fallbackIcons.decorative);
    });
  });

  describe('Icon Sizes', () => {
    it('should have complete size scale', () => {
      const expectedSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
      
      expectedSizes.forEach(size => {
        expect(iconSizes).toHaveProperty(size);
        expect(typeof iconSizes[size]).toBe('number');
        expect(iconSizes[size]).toBeGreaterThan(0);
      });
    });

    it('should have ascending size values', () => {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
      
      for (let i = 1; i < sizes.length; i++) {
        expect(iconSizes[sizes[i]]).toBeGreaterThan(iconSizes[sizes[i - 1]]);
      }
    });

    it('should have reasonable size values', () => {
      expect(iconSizes.xs).toBe(12);
      expect(iconSizes.base).toBe(16);
      expect(iconSizes.xl).toBe(24);
    });
  });

  describe('Icon Colors', () => {
    it('should have all semantic colors', () => {
      const expectedColors = ['primary', 'success', 'warning', 'error', 'neutral', 'muted'];
      
      expectedColors.forEach(color => {
        expect(iconColors).toHaveProperty(color);
        expect(typeof iconColors[color]).toBe('string');
        expect(iconColors[color]).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should match theme color palette', () => {
      expect(iconColors.primary).toBe('#0ea5e9');
      expect(iconColors.success).toBe('#22c55e');
      expect(iconColors.warning).toBe('#f59e0b');
      expect(iconColors.error).toBe('#ef4444');
      expect(iconColors.neutral).toBe('#6b7280');
    });
  });
});