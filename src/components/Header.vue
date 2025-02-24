<script setup>
import { ref, onMounted } from "vue";
import { RiLogoutBoxRLine } from "@remixicon/vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import NavigationBar from "./NavigationBar.vue";

const currentTime = ref("");
const currentDate = ref("");
const router = useRouter();
const errorMessage = ref("");
const authStore = useAuthStore();

defineProps({
  pos: { type: String, default: "" },
});

const updateDateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  currentDate.value = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const logout = async () => {
  try {
    await authStore.logout(); // Calls the Pinia store's logout method
    router.push("/login");
  } catch (error) {
    errorMessage.value = error.message || "Logout failed!";
  }
};

// Initialize and keep updating the time every second
onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>

<template>
  <header
    class="w-full bg-blue-500 text-white shadow-lg z-50 p-3 lg:pt-0 max-md:pb-3 h-fit lg:max-h-[105px] lg:min-h-[105px]"
  >
    <div>
      <div
        class="px-0 mx-auto flex flex-col md:flex-row justify-between items-center lg:space-y-2 lg:px-4"
      >
        <!-- Logo and Text -->
        <img
          src="@/assets/dostlogo.png"
          alt="DOST Logo"
          class="rounded block md:hidden 2xs:w-[4rem] 2xs:h-[4rem]"
        />
        <div class="flex items-center my-1 md:my-0 space-x-4">
          <img
            src="@/assets/dostlogo.png"
            alt="DOST Logo"
            class="rounded hidden md:block sm:w-20 sm:h-20"
          />
          <div class="text-center md:text-left">
            <h1 class="font-bold uppercase text-[10px] sm:text-xs lg:text-sm">
              Republic of the Philippines
            </h1>
            <h2 class="text-md sm:text-lg font-bold">
              Department of Science and Technology
            </h2>
            <h3 class="text-yellow-300 text-sm sm:text-base lg:text-xl font-semibold">
              PSTO - Surigao del Norte
            </h3>
          </div>
        </div>
        <!-- Date and Time -->
        <div class="flex flex-col mt-0">
          <div class="flex flex-col text-center md:text-right lg:text-left lg:flex-row">
            <p class="text-md content-center sm:text-2xl font-bold">{{ currentTime }}</p>
            <div class="lg:ml-4">
              <p class="text-sm lg:text-base">{{ currentDate }}</p>
              <p class="text-left uppercase text-[10px] sm:text-xs text-gray-300">
                Philippine Standard Time
              </p>
            </div>
          </div>
          <!-- Logout Button -->
          <div class="place-items-end pt-2">
            <div class="flex justify-end">
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
  <div>
    <div><NavigationBar /></div>
  </div>
</template>
