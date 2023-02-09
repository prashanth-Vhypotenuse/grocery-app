import Toaster from "./Toaster.vue";
import createToaster from "./api";
import Positions from "./defaults/positions";

const Plugin = (app: any, options: any = {}) => {
  const methods = createToaster(options);
  app.$toast = methods;
  app.config.globalProperties.$toast = methods;
};

Toaster.install = Plugin;

export default Toaster;
export { Toaster, Positions, createToaster };
