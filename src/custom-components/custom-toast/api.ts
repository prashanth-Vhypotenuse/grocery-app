import Toaster from "./Toaster.vue";
import eventBus from "./helpers/event-bus";
import mount from "./helpers/mount-component";

const Api = (globalOptions = {}) => {
  return {
    show(message: string, options: any = {}) {
      const localOptions = { message, ...options };
      const c = mount(Toaster, {
        props: { ...globalOptions, ...localOptions },
      });
      return c;
    },
    clear() {
      eventBus.$emit("toast-clear");
    },
    success(message: string, options: any = {}) {
      options.type = "success";
      return this.show(message, options);
    },
    error(message: string, options: any = {}) {
      options.type = "error";
      return this.show(message, options);
    },
    info(message: string, options: any = {}) {
      options.type = "info";
      return this.show(message, options);
    },
    warning(message: string, options: any = {}) {
      options.type = "warning";
      return this.show(message, options);
    },
  };
};

export default Api;
