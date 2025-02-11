<script setup>
import { ref, onMounted } from "vue";
import { RiLogoutBoxRLine } from "@remixicon/vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const currentDateTime = ref("");

defineProps({
  pos: { type: String, default: "" },
});

const updateDateTime = () => {
  currentDateTime.value = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout(); // Call the logout action from Pinia store
  router.push("/login"); // Redirect to login page after logout
};

// Initialize and keep updating the time every second
onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>

<template>
  <header :class="`${pos} bg-blue-500 text-black p-3`">
    <div>
      <div
        class="px-4 mx-auto flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
      >
        <!-- Logo and Text -->
        <div class="flex items-center space-x-4">
          <img
            src="@/assets/dostlogo.png"
            alt="DOST Logo"
            class="rounded w-24 h-24 lg:w-32 lg:h-32"
          />
          <div class="text-center lg:text-left">
            <h1 class="font-bold uppercase text-xs lg:text-sm">
              Republic of the Philippines
            </h1>
            <h2 class="text-base lg:text-lg font-bold">
              Department of Science and Technology
            </h2>
            <h3 class="text-yellow-300 text-lg lg:text-xl font-semibold">
              PSTO - Surigao del Norte
            </h3>
          </div>
        </div>
        <!-- Date and Time -->
        <div class="flex flex-col">
          <div class="text-center lg:text-right text-sm">
            <p>Philippine Standard Time:</p>
            <p>{{ currentDateTime }}</p>
          </div>
          <!-- Logout Button -->
          <div class="place-items-end pt-2">
            <div class="pt-2 flex justify-end">
              <button
                @click="logout"
                class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 md:text-lg"
              >
                <p>Logout</p>
                <RiLogoutBoxRLine />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
