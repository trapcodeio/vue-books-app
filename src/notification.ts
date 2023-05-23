import { ref } from "vue";
import { defineStore } from "pinia";

type Notification = {
  message: string;
  type: "success" | "error";
};

export const useNotification = defineStore("notification", () => {
  const data = ref<Notification>();

  // A function to show a notification
  function notify(
    message: string,
    type: Notification["type"] = "success",
    timeout = 5000
  ) {
    data.value = { message, type };
    setTimeout(clear, timeout);
  }

  // Clear the notification
  function clear() {
    data.value = undefined;
  }

  return { notify, clear, data };
});
