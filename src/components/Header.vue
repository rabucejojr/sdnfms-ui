<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { RiLogoutBoxRLine } from "@remixicon/vue";

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

// Use Vue Router
const router = useRouter();

// Logout function with redirect
const logout = () => {
  console.log("Logging out...");
  // Implement actual logout logic here, e.g., clearing user session or tokens
  router.push("/login"); // Redirect to the login page
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
                <!-- Hide the text on small screens -->
                <!-- <span class="hidden sm:block">Logout</span> -->
                <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H3"></path>
                </svg> -->
                <RiLogoutBoxRLine />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
