import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

import { Flex } from '@strapi/design-system';
import EditorIcon from './icon';

export default {
  register(app: any) {
    // app.addMenuLink({
    //   to: `plugins/${PLUGIN_ID}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: PLUGIN_ID,
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');

    //     return App;
    //   },
    // });

    // app.registerPlugin({
    //   id: PLUGIN_ID,
    //   initializer: Initializer,
    //   isReady: false,
    //   name: PLUGIN_ID,
    // });

    app.customFields.register({
      name: "EditorJS",
      type: "richtext",
      pluginId: PLUGIN_ID,
      intlLabel: {
        id: "strapi-plugin-editorjs.label",
        defaultMessage: "EditorJS"
      },
      intlDescription: {
        id: "strapi-plugin-editorjs.description",
        defaultMessage: "The easy to use rich text editor"
      },
      components: {
        Input: async () => await import("./components/editorjs/editorjs")
      },
      icon: EditorIcon
    })
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
