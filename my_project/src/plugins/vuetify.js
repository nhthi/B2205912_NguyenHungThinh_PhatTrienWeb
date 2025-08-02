// Vuetify 3 - setup
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // 👈 chỉ định mặc định là mdi
    aliases,
    sets: {
      mdi,
    },
  },
});
