<script setup>
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Header from "@/components/Header.vue";
import { RiAddLine } from "@remixicon/vue";
import { ref } from "vue";
import AddDocument from "./AddDocument.vue";

// Define component props
defineProps({
  padding: {
    type: String,
    default: "mt-2",
  },
});

const isAddDocumentModalOpen = ref(false);

const handleUploadComplete = async (success) => {
  console.log("Clicked");
};

const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
});

const fetchRecentFiles = async () => {
  console.log("Fetch Files Clicked");
};
</script>

<template>
  <Header />
  <div class="p-2 sm:pl-6 pr-6 bg-gray-100 min-h-screen">
    <!-- Stats Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card>
        <h2 class="text-sm sm:text-lg font-medium">Total Files</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalFiles }}</p>
      </Card>

      <Card bg="bg-green-500">
        <h2 class="text-sm sm:text-lg font-medium">Total Users</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalUsers }}</p>
      </Card>

      <Card bg="bg-yellow-400">
        <h2 class="text-sm sm:text-lg font-medium">Total Users</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalUsers }}</p>
      </Card>
    </div>
    <!-- Recent Files Section -->
    <section class="recent-files bg-white p-4 sm:p-6 rounded shadow">
      <!-- Search and Upload Controls -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
      >
        <!-- Upload Button -->
        <Button
          @click=""
          bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <span>Add Document</span>
          <RiAddLine />
        </Button>
      </div>

      <!-- Files Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200 text-gray-700 text-sm sm:text-base">
              <th class="border p-3 text-left">File Name</th>
              <th class="border p-3 text-left">Uploaded By</th>
              <th class="border p-3 text-left">Date</th>
              <th class="border p-3 text-left">Category</th>
              <th class="border p-3 text-center">Actions</th>
            </tr>
          </thead>

          <!-- Table Body with File Rows -->
          <tbody>
            <tr
              v-for="data in file"
              :key="data.id"
              class="odd:bg-white even:bg-gray-50 text-sm sm:text-base"
            >
              <td class="border p-3">{{ data.filename }}</td>
              <td class="border p-3">{{ data.uploader }}</td>
              <td class="border p-3">{{ data.date }}</td>
              <td class="border p-3">{{ data.category.toUpperCase() }}</td>
              <td class="border p-3">
                <!-- Action Buttons -->
                <div
                  class="flex flex-col justify-center sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
                >
                  <div class="items-center">
                    <!-- <Button
                      @click="previewFile(data)"
                      bg="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                    >
                      <RiEyeLine />
                    </Button> -->
                  </div>

                  <!-- <Button
                    @click="updateFile(data)"
                    bg="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                  >
                    <RiEdit2Line />
                  </Button> -->

                  <!-- <Button
                    @click="deleteFile(data)"
                    bg="bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                  >
                    <RiDeleteBin2Line />
                  </Button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Components -->
        <AddDocument
          :isOpen="isAddDocumentModalOpen"
          @close="isAddDocumentModalOpen = false"
          @upload-complete="handleUploadComplete"
          :fetchRecentFiles="fetchRecentFiles"
        />
      </div>
    </section>
  </div>
</template>
