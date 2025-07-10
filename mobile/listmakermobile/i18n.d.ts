import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: {
        common: {
            yes: string;
            no: string;
        };
        templates: {
            new: string;
            info: string;
            name: string;
            description: string;
            category: string;
        };
      };
    };
  }
}
