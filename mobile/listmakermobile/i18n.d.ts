import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: {
        common: {
            yes: string;
            no: string;
            save: string;
            menu: string;
        };
        settings: {
            title: string;
            dark_theme: string;
        };
        user: {
            username: string;
            password: string;
            login: string;
            logout: string;
            login_error: string;
            logged_in_as: string;
        };
        templates: {
            new: string;
            info: string;
            creator: string;
            cover_image: string;
            pick_cover_img: string;
            name: string;
            description: string;
            category: string;
            items: string;
            add_items: string;
            make_blank: string;
            blank_desc: string;
            has_images: string;
            errors: {
                no_title: string;
                not_enough_items: string;
                missing_image: string;
                missing_item_name: string;
            };
        };
      };
    };
  }
}
