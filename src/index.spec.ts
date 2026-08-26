/* eslint-disable @typescript-eslint/no-magic-numbers, jsdoc/require-jsdoc, @typescript-eslint/explicit-function-return-type */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { KeyAddedEvent, KeyRemovedEvent, ToolType, ValueNodeChangedEvent } from '@editorjs/sdk';
import type { EditorAPI } from '@editorjs/sdk';
import type { DOMBlockToolAdapter } from '@editorjs/dom-adapters';
import { Header } from './index.js';
import type { HeaderData, HeaderConfig, HeadingLevel } from './index.js';

const createMockAdapter = () => {
  const base = new EventTarget();
  const realAddEventListener = base.addEventListener.bind(base);

  return Object.assign(base, {
    registerTextInputKey: jest.fn(),
    registerValueKey: jest.fn(),
    setInput: jest.fn(),
    getBlockId: jest.fn<() => string>().mockReturnValue('test-block-id'),
    getBlockIndex: jest.fn<() => number>().mockReturnValue(0),
    addEventListener: jest.fn(realAddEventListener),
  });
};

let mockAdapter: ReturnType<typeof createMockAdapter>;

beforeEach(() => {
  mockAdapter = createMockAdapter();
});

const createHeader = (
  levelInput: unknown,
  configOverrides: Partial<HeaderConfig> = {}
): InstanceType<typeof Header> => {
  return new Header({
    adapter: mockAdapter as unknown as DOMBlockToolAdapter,
    data: { level: levelInput } as unknown as HeaderData,
    config: configOverrides as HeaderConfig,
    api: {} as EditorAPI,
  } as never);
};

describe('Header', () => {
  describe('static fields', () => {
    it('should have type set to Block and name set to header', () => {
      expect(Header.type).toBe(ToolType.Block);
      expect(Header.name).toBe('header');
    });

    it('should expose options as a function of config', () => {
      expect(typeof Header.options).toBe('function');
    });

    it('should offer a toolbox entry for every level when config.levels is omitted', () => {
      const { toolbox } = Header.options({} as HeaderConfig);
      const entries = toolbox as { title: string;
        data: { level: HeadingLevel }; }[];

      expect(entries.map(entry => entry.data.level)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(entries.map(entry => entry.title)).toEqual([
        'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6',
      ]);
    });

    it('should restrict toolbox entries to config.levels, in the given order', () => {
      const { toolbox } = Header.options({ levels: [3, 1] } as HeaderConfig);
      const entries = toolbox as { data: { level: HeadingLevel } }[];

      expect(entries.map(entry => entry.data.level)).toEqual([3, 1]);
    });

    it('should have conversionConfig with import and export pointing to the text key', () => {
      const { conversionConfig } = Header.options({} as HeaderConfig);

      expect(conversionConfig).toEqual({ import: 'text',
        export: 'text' });
    });

    it('should have canBeSplit set to false', () => {
      expect(Header.options({} as HeaderConfig).canBeSplit).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should register text and level data nodes and subscribe to adapter events', () => {
      createHeader(2);

      expect(mockAdapter.registerTextInputKey).toHaveBeenCalledWith('text', undefined);
      expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 2);
      expect(mockAdapter.addEventListener).toHaveBeenCalledWith(
        'adapter:updated',
        expect.any(Function)
      );
    });

    describe('level normalisation via registerValueKey', () => {
      it.each([1, 2, 3, 4, 5, 6] as const)(
        'should register level %i as-is when data.level is a valid integer',
        (level) => {
          createHeader(level);
          expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', level);
        }
      );

      it.each([undefined, null, 'text', 0, 7, -1, 1.5])(
        'should register default level 2 when data.level is %p',
        (level) => {
          createHeader(level);
          expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 2);
        }
      );

      it('should use config.defaultLevel when raw level is invalid', () => {
        createHeader(undefined, { defaultLevel: 4 });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 4);
      });

      it('should fall back to 2 when both data.level and config.defaultLevel are invalid', () => {
        createHeader(undefined, { defaultLevel: 99 as HeadingLevel });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 2);
      });
    });

    describe('level restriction via config.levels', () => {
      it('should reject a raw level outside config.levels and fall back to defaultLevel', () => {
        createHeader(2, { levels: [3, 4],
          defaultLevel: 4 });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 4);
      });

      it('should reject config.defaultLevel when it is outside config.levels', () => {
        createHeader(undefined, { levels: [3, 4],
          defaultLevel: 6 });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 3);
      });

      it('should fall back to the first allowed level when the static default (2) is not in config.levels', () => {
        createHeader(undefined, { levels: [4, 5, 6] });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 4);
      });

      it('should treat an empty or fully invalid config.levels as if it were absent', () => {
        createHeader(5, { levels: [0, 7] as unknown as HeadingLevel[] });
        expect(mockAdapter.registerValueKey).toHaveBeenCalledWith('level', 5);
      });

      it('should also restrict levels applied later via ValueNodeChangedEvent', () => {
        const header = createHeader(4, { levels: [3, 4] });
        const wrapper = header.render();

        mockAdapter.dispatchEvent(new KeyAddedEvent('text'));
        mockAdapter.setInput.mockClear();

        // 6 is outside `levels`, and the static default (2) is too, so it should
        // collapse to the first allowed level (3) rather than accepting 6 as-is.
        mockAdapter.dispatchEvent(new ValueNodeChangedEvent('level', 6));

        expect(wrapper.querySelector('h3')).not.toBeNull();
        expect(wrapper.querySelector('h6')).toBeNull();
        expect(mockAdapter.setInput).toHaveBeenCalled();
      });
    });
  });

  describe('render()', () => {
    it('should return an HTMLElement', () => {
      const header = createHeader(2);

      expect(header.render()).toBeInstanceOf(HTMLElement);
    });

    it('should return the same element on subsequent calls', () => {
      const header = createHeader(2);

      expect(header.render()).toBe(header.render());
    });
  });

  describe('#onUpdate — KeyAddedEvent text', () => {
    it.each([1, 2, 3, 4, 5, 6] as const)(
      'should create h%i, call setInput, and append to wrapper when text key is added with level %i',
      (level) => {
        const header = createHeader(level);
        const wrapper = header.render();

        mockAdapter.dispatchEvent(new KeyAddedEvent('text'));

        const heading = wrapper.querySelector(`h${level}`) as HTMLElement;

        expect(heading).not.toBeNull();
        expect(heading.contentEditable).toBe('true');
        expect(mockAdapter.setInput).toHaveBeenCalledWith('text', heading);
      }
    );

    it('should not react to KeyAddedEvent for keys other than text', () => {
      const header = createHeader(2);

      header.render();

      mockAdapter.dispatchEvent(new KeyAddedEvent('someOtherKey'));

      expect(mockAdapter.setInput).not.toHaveBeenCalled();
    });
  });

  describe('#onUpdate — KeyRemovedEvent text', () => {
    it('should call setInput with undefined and remove element from wrapper', () => {
      const header = createHeader(2);
      const wrapper = header.render();

      mockAdapter.dispatchEvent(new KeyAddedEvent('text'));
      expect(wrapper.firstElementChild).not.toBeNull();

      mockAdapter.setInput.mockClear();
      mockAdapter.dispatchEvent(new KeyRemovedEvent('text'));

      expect(mockAdapter.setInput).toHaveBeenCalledWith('text', undefined);
      expect(wrapper.firstElementChild).toBeNull();
    });

    it('should not react to KeyRemovedEvent for keys other than text', () => {
      const header = createHeader(2);

      header.render();
      mockAdapter.dispatchEvent(new KeyAddedEvent('text'));
      mockAdapter.setInput.mockClear();

      mockAdapter.dispatchEvent(new KeyRemovedEvent('someOtherKey'));

      expect(mockAdapter.setInput).not.toHaveBeenCalled();
    });
  });

  describe('#onUpdate — ValueNodeChangedEvent level', () => {
    const setupWithHeading = (initialLevel: HeadingLevel): {
      header: InstanceType<typeof Header>;
      wrapper: HTMLElement;
    } => {
      const header = createHeader(initialLevel);
      const wrapper = header.render();

      mockAdapter.dispatchEvent(new KeyAddedEvent('text'));
      mockAdapter.setInput.mockClear();

      return { header,
        wrapper };
    };

    it.each<[HeadingLevel, HeadingLevel]>([[2, 1], [1, 6], [3, 4]])(
      'should replace h%i with h%i and call setInput with new element when level changes',
      (from, to) => {
        const { wrapper } = setupWithHeading(from);

        mockAdapter.dispatchEvent(new ValueNodeChangedEvent('level', to));

        const heading = wrapper.querySelector(`h${to}`) as HTMLElement;

        expect(heading).not.toBeNull();
        expect(mockAdapter.setInput).toHaveBeenCalledWith('text', heading);
      }
    );

    it('should not recreate the element when the level value is identical', () => {
      const { wrapper } = setupWithHeading(2);
      const originalHeading = wrapper.querySelector('h2');

      mockAdapter.dispatchEvent(new ValueNodeChangedEvent('level', 2));

      expect(wrapper.querySelector('h2')).toBe(originalHeading);
      expect(mockAdapter.setInput).not.toHaveBeenCalled();
    });

    it('should not react to ValueNodeChangedEvent for keys other than level', () => {
      const { wrapper } = setupWithHeading(2);
      const originalHeading = wrapper.querySelector('h2');

      mockAdapter.dispatchEvent(new ValueNodeChangedEvent('someOtherKey', 'value'));

      expect(wrapper.querySelector('h2')).toBe(originalHeading);
      expect(mockAdapter.setInput).not.toHaveBeenCalled();
    });
  });
});
