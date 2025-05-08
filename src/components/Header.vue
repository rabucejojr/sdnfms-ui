<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RiLogoutBoxRLine } from "@remixicon/vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import NavigationBar from "./NavigationBar.vue";

// Reactive state
const currentTime = ref("");
const currentDate = ref("");
const errorMessage = ref("");
const authStore = useAuthStore();
const router = useRouter();

defineProps({
  pos: { type: String, default: "" },
});

let intervalId = null;

// Helper: Update date and time in Asia/Manila timezone
const updateDateTime = () => {
  try {
    const now = new Date();
    // Use Intl.DateTimeFormat for reliable timezone formatting
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    currentTime.value = timeFormatter.format(now);
    currentDate.value = dateFormatter.format(now);
  } catch (e) {
    // Fallback to local time if Intl fails
    currentTime.value = now.toLocaleTimeString();
    currentDate.value = now.toLocaleDateString();
  }
};

// Logout handler
const logout = async () => {
  try {
    await authStore.logout?.(); // Defensive: handle undefined logout
    await router.push("/login");
  } catch (error) {
    errorMessage.value = error?.message || "Logout failed!";
  }
};

// Start interval on mount, clear on unmount
onMounted(() => {
  updateDateTime();
  intervalId = setInterval(updateDateTime, 1000);
});
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
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
          loading="lazy"
        />
        <div class="flex items-center my-1 md:my-0 space-x-4">
          <img
            src="@/assets/dostlogo.png"
            alt="DOST Logo"
            class="rounded hidden md:block sm:w-20 sm:h-20"
            loading="lazy"
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
            <p class="text-md content-center sm:text-2xl font-bold" aria-live="polite">{{ currentTime }}</p>
            <div class="lg:ml-4">
              <p class="text-sm lg:text-base" aria-live="polite">{{ currentDate }}</p>
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
                type="button"
                aria-label="Logout"
              >
                <span>Logout</span>
                <RiLogoutBoxRLine />
              </button>
            </div>
            <div v-if="errorMessage" class="text-red-200 text-xs mt-1" role="alert">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div>
    <NavigationBar />
  </div>
</template>
