<script setup>
import { ref, onMounted, computed } from 'vue';
import Update from './Update.vue';
import Upload from './Upload.vue';
import Delete from './Delete.vue';
import Preview from './Preview.vue';
import { RiEdit2Line, RiDeleteBin2Line, RiUpload2Line, RiEyeLine, RiSearchLine } from '@remixicon/vue';
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';
import Header from '@/components/Header.vue';

defineProps({
  padding: {
    type: String,
    default: 'mt-2',
  },
});

// Stats
const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
  recentUploads: 8,
  storageUsed: 25.6,
});

// Recent files
const recentFiles = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');

// Filtered files based on search query
const filteredFiles = computed(() => {
  return Array.isArray(recentFiles.value)
    ? recentFiles.value.filter(file =>
        file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : [];
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredFiles.value.length / pageSize.value));
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFiles.value.slice(start, end);
});
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

// Fetch files from the API
const fetchRecentFiles = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/files');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    // Assuming API response structure is { files: [...] }
    recentFiles.value = Array.isArray(data.files) ? data.files : [];
  } catch (error) {
    console.error('Error fetching recent files:', error);
    recentFiles.value = []; // Reset to empty on error
  }
};

// Modal state and methods
const isPreviewModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const selectedFile = ref({});

const updateFile = (file) => {
  selectedFile.value = file;
  isEditModalOpen.value = true;
};

const previewFile = (file) => {
  selectedFile.value = file;
  isPreviewModalOpen.value = true;
};

const deleteFile = (file) => {
  selectedFile.value = file;
  isDeleteModalOpen.value = true;
};

const goToUpload = () => {
  isUploadModalOpen.value = true;
};

// Fetch data when component is mounted
onMounted(fetchRecentFiles);
</script>



<template>
  <Header />
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <h2 class="text-sm sm:text-lg font-medium">Total Files</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalFiles }}</p>
      </Card>
      <Card bg="bg-green-500">
        <h2 class="text-sm sm:text-lg font-medium">Total Users</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalUsers }}</p>
      </Card>
      <Card bg="bg-yellow-500">
        <h2 class="text-sm sm:text-lg font-medium">Recent Uploads</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.recentUploads }}</p>
      </Card>
      <Card bg="bg-red-500">
        <h2 class="text-sm sm:text-lg font-medium">Storage Used</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.storageUsed }} GB</p>
      </Card>
    </div>

    <!-- Recent Files Table -->
    <section class="recent-files bg-white p-4 sm:p-6 rounded shadow">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <!-- <input
          v-model="searchQuery"
          type="text"
          placeholder="Search files..."
          class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        /> -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search files..."
            class="px-4 py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
          <RiSearchLine
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="20"
          />
      </div>
        <Button
          @click="goToUpload"
          bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <span>File Upload</span>
          <RiUpload2Line />
        </Button>
      </div>

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
          <tbody>
            <tr
              v-for="file in paginatedFiles"
              :key="file.id"
              class="odd:bg-white even:bg-gray-50 text-sm sm:text-base"
            >
              <td class="border p-3">{{ file.name }}</td>
              <td class="border p-3">{{ file.uploadedBy }}</td>
              <td class="border p-3">{{ file.date }}</td>
              <td class="border p-3">{{ file.category }}</td>
              <td class="border p-3 ">
                <div class="flex flex-col justify-center sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <div class="items-center">
                    <Button @click="previewFile(file)" bg="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center">
                      <RiEyeLine />
                    </Button>
                  </div>
                  <Button @click="updateFile(file)" bg="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center">
                    <RiEdit2Line />
                  </Button>
                  <Button @click="deleteFile(file)" bg="bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center">
                    <RiDeleteBin2Line />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Modals -->
        <Update
        :isOpen="isEditModalOpen"
        :file="selectedFile"
        @close="isEditModalOpen = false"
      />

      <Preview
        :isOpen="isPreviewModalOpen"
        :file="selectedFile"
        @close="isPreviewModalOpen = false"
      />

      <Delete
        :isOpen="isDeleteModalOpen"
        :file="selectedFile"
        @close="isDeleteModalOpen = false"
      />

      <Upload
        :isOpen="isUploadModalOpen"
        @close="isUploadModalOpen = false"
      />
      </div>

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

