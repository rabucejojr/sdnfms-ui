<script setup>
import Header from "@/components/Header.vue";

// Define component props
defineProps({
  padding: {
    type: String,
    default: "mt-2",
  },
});

</script>

<template>
  <Header />
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <!-- Recent Files Section -->
    <section class="recent-files bg-white p-4 sm:p-6 rounded shadow">
      <!-- Search and Upload Controls -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
      >

        <!-- Upload Button -->
        <Button
          @click="goToUpload"
          bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <span>File Upload</span>
          <RiUpload2Line />
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
              v-for="data in paginatedFiles"
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
                    <Button
                      @click="previewFile(data)"
                      bg="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                    >
                      <RiEyeLine />
                    </Button>
                  </div>

                  <Button
                    @click="updateFile(data)"
                    bg="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                  >
                    <RiEdit2Line />
                  </Button>

                  <Button
                    @click="deleteFile(data)"
                    bg="bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                  >
                    <RiDeleteBin2Line />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Components -->
        <Update
          :isOpen="isEditModalOpen"
          :data="selectedFile"
          @close="isEditModalOpen = false"
          :fetchRecentFiles="fetchRecentFiles"
        />

        <Preview
          :isOpen="isPreviewModalOpen"
          :data="selectedFile"
          @close="isPreviewModalOpen = false"
        />

        <Delete
          :isOpen="isDeleteModalOpen"
          :file="selectedFile"
          @close="isDeleteModalOpen = false"
          @delete-complete="handleDeleteComplete"
          :fetchRecentFiles="fetchRecentFiles"
        />

        <Upload
          :isOpen="isUploadModalOpen"
          @close="isUploadModalOpen = false"
          @upload-complete="handleUploadComplete"
          :fetchRecentFiles="fetchRecentFiles"
        />
      </div>

      <!-- Pagination Controls -->
      <div class="flex flex-wrap justify-center items-center space-x-2 mt-4">
        <button
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-2 rounded"
          :class="{
            'bg-blue-500 text-white': page === currentPage,
            'bg-gray-300 hover:bg-gray-400': page !== currentPage,
          }"
        >
          {{ page }}
        </button>

        <button
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </section>
  </div>
</template>
