declare module '@editorjs/header' {
    import { IconType } from '@codexteam/icons';
  
    interface HeaderData {
      text: string;
      level: number;
    }
  
    interface HeaderConfig {
      placeholder: string;
      levels: number[];
      defaultLevel: number;
    }
  
    interface Level {
      number: number;
      tag: string;
      svg: IconType;
    }
  
    class Header {
      constructor(options: {
        data: HeaderData;
        config: HeaderConfig;
        api: object;
        readOnly: boolean;
      });
  
      render(): HTMLHeadingElement;
  
      renderSettings(): Array<{
        icon: IconType;
        label: string;
        onActivate: () => void;
        closeOnActivate: boolean;
        isActive: boolean;
      }>;
  
      setLevel(level: number): void;
  
      merge(data: HeaderData): void;
  
      validate(blockData: HeaderData): boolean;
  
      save(toolsContent: HTMLHeadingElement): HeaderData;
  
      static get conversionConfig(): { export: string; import: string };
  
      static get sanitize(): { level: boolean; text: object };
  
      static get isReadOnlySupported(): boolean;
  
      get data(): HeaderData;
  
      set data(data: HeaderData);
  
      getTag(): HTMLElement;
  
      get currentLevel(): Level;
  
      get defaultLevel(): Level;
  
      get levels(): Level[];
  
      onPaste(event: { detail: { data: HTMLElement } }): void;
  
      static get pasteConfig(): { handler: (element: HTMLElement) => { text: string }; tags: string[] };
  
      static get toolbox(): { icon: IconType; title: string };
    }
  
    export = Header;
  }
  