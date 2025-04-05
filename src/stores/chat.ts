import {defineStore} from "pinia";
import {ref} from "vue";
import {useUserStore} from "./user";
import axios from "axios";

type ChatMessage = {
  message: string;
  reply: string;
};

type FormattedMessage = {
  role: "user" | "ai";
  content: string;
};

export const useChatStore = defineStore("chat", () => {
  const messages = ref<{role: string; content: string}[]>([]);
  const isLoading = ref(false);
  const userStore = useUserStore();

  const loadChatHistory = async () => {
    if (!userStore.userId) return;

    try {
      const {data} = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/get-messages`,
        data: {
          userId: userStore.userId,
        },
      });

      console.log("chat history: ", data);

      messages.value = data.messages
        .flatMap((msg: ChatMessage): FormattedMessage[] => {
          return [
            {role: "user", content: msg.message},
            {role: "ai", content: msg.reply},
          ];
        })
        .filter((msg: FormattedMessage) => msg.content);
    } catch (err) {
      console.error("Error loading chat history: ", err);
    }
  };

  const sendMessage = async (msg: string) => {
    if (!msg.trim() || !userStore.userId) return;

    messages.value.push({role: "user", content: msg});

    isLoading.value = true;

    try {
      const {data} = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/chat`,
        data: {
          message: msg,
          userId: userStore.userId,
        },
      });

      console.log("test: ", data);
      messages.value.push({role: "ai", content: data.reply});
    } catch (err) {
      console.error("Error sending message: ", err);
      messages.value.push({
        role: "ai",
        content: "Error: unable to process request",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    messages,
    isLoading,
    loadChatHistory,
    sendMessage,
  };
});
