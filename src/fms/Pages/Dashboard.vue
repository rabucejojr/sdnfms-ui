<script setup>
// Import necessary Vue and component dependencies
import { ref, onMounted, computed } from "vue";
import Update from "./Update.vue";
import Upload from "./Upload.vue";
import Delete from "./Delete.vue";
import Preview from "./Preview.vue";

import { RiEdit2Line, RiDeleteBin2Line, RiUpload2Line, RiEyeLine } from "@remixicon/vue";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";
import Header from "@/components/Header.vue";
import axios from "axios";
import SearchComponent from "@/components/SearchComponent.vue";
import DataTable from "@/components/DataTable.vue";

// Define component props
defineProps({
  padding: {
    type: String,
    default: "mt-2",
  },
});

// Function to fetch SFTP storage details from Laravel API
const fetchFileCount = async () => {
  try {
    const response = await axios.get(`${API}/sftp/size`);
    if (response.status === 200) {
      stats.value.totalFiles = response.data.file_count;
      stats.value.storageUsed = response.data.storage_used;
    }
  } catch (error) {
    console.error("Error fetching SFTP storage details:", error);
  }
};

// Mock statistics data for dashboard overview
const stats = ref({
  totalFiles: 0,
  totalUsers: 15,
  totalStorage: 4.69,
  storageUsed: 0,
});

// State management for file pagination and search
const recentFiles = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");

const API = import.meta.env.VITE_API;

// Computed properties for filtering and paginating files
const filteredFiles = computed(() => {
  if (!Array.isArray(recentFiles.value)) return [];

  // Filter files based on search query across multiple fields
  const query = searchQuery.value.toLowerCase();
  return recentFiles.value.filter((file) => {
    return (
      file.filename?.toLowerCase().includes(query) ||
      file.uploader?.toLowerCase().includes(query) ||
      file.category?.toLowerCase().includes(query) ||
      file.date?.toLowerCase().includes(query)
    );
  });
});

// Calculate total number of pages based on filtered results
const totalPages = computed(() => Math.ceil(filteredFiles.value.length / pageSize.value));

// Get current page of files based on pagination settings
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFiles.value.slice(start, end);
});

// Navigation methods for pagination
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
  }
};

// API methods for fetching file data
const fetchRecentFiles = async () => {
  try {
    const response = await fetch(`${API}/files`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    recentFiles.value = data.files || [];
  } catch (error) {
    console.error("Error fetching recent files:", error.message || error);
    recentFiles.value = [];
  }
};

// State management for modal dialogs
const isPreviewModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const selectedFile = ref({});

// Modal action handlers for file operations
const updateFile = (data) => {
  selectedFile.value = data;
  isEditModalOpen.value = true;
};

const previewFile = (data) => {
  selectedFile.value = data;
  isPreviewModalOpen.value = true;
};

const deleteFile = (data) => {
  selectedFile.value = data;
  isDeleteModalOpen.value = true;
};

// Handle completion of delete operation
const handleDeleteComplete = async (success) => {
  if (success) {
    try {
      const response = await axios.delete(`${API}/files/${selectedFile.value.id}`);

      if (response.status === 200) {
        // Remove deleted file from local state
        recentFiles.value = recentFiles.value.filter(
          (file) => file.id !== selectedFile.value.id
        );

        // Close modal dialog
        isDeleteModalOpen.value = false;

        // Refresh file list from server
        setTimeout(() => {
          props.fetchRecentFiles();
        }, 500);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};

// Handle completion of upload operation
const handleUploadComplete = async (success) => {
  if (success) {
    // Close upload modal
    isUploadModalOpen.value = false;

    // Refresh file list from server
    setTimeout(() => {
      fetchRecentFiles();
    }, 500);
  }
};

// Open upload modal
const goToUpload = () => {
  isUploadModalOpen.value = true;
};

const query = (query) => {
  searchQuery.value = query;
};

// Fetch initial data when component mounts
onMounted(() => {
  fetchRecentFiles();
  fetchFileCount();
});
</script>

<template>
  <Header />
  <div class="p-2 sm:pl-6 pr-6 bg-gray-100 min-h-screen">
    <!-- Stats Overview Cards -->
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
        <h2 class="text-sm sm:text-lg font-medium">Total Storage</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.totalStorage }} TB</p>
      </Card>

      <Card bg="bg-red-500">
        <h2 class="text-sm sm:text-lg font-medium">Storage Used</h2>
        <p class="text-3xl sm:text-4xl font-bold">{{ stats.storageUsed }} GB</p>
      </Card>
    </div>

    <!-- Recent Files Section -->
    <section class="recent-files bg-white p-4 sm:p-6 rounded shadow">
      <!-- Search and Upload Controls -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
      >
        <!-- Search Input with Icon -->
        <SearchComponent :searchQuery="query" placeholder="Search Document..." />

        <!-- Upload Button Component -->
        <Button
          @click="goToUpload"
          bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <span>File Upload</span>
          <RiUpload2Line />
        </Button>
      </div>

      <!-- Data table with pagination for documents -->
      <DataTable
        :items="paginatedFiles"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :goToPage="goToPage"
      >
        <!-- Table Headers -->
        <template #header>
          <th class="border p-3 w-1/4">File Name</th>
          <th class="border p-3 text-center">Uploader</th>
          <th class="border p-3 text-center">Date</th>
          <th class="border p-3 text-center">Category</th>
          <th class="border p-3 text-center">Actions</th>
        </template>

        <!-- Table Rows -->
        <template #row="{ item }">
          <td class="border p-3">{{ item.filename }}</td>
          <td class="border p-3 text-center">{{ item.uploader }}</td>
          <td class="border p-3 text-center">{{ item.date }}</td>
          <td class="border p-2 text-center">
            <span
              class="px-4 py-2 text-sm font-semibold rounded-lg inline-block"
              :class="{
                'bg-green-200 text-green-800': item.category === 'setup',
                'bg-yellow-200 text-yellow-800': item.category === 'gia',
                'bg-blue-200 text-blue-800': item.category === 'others',
                'bg-gray-200 text-gray-800': !['setup', 'gia', 'others'].includes(
                  item.category
                ),
              }"
            >
              {{ item.category.toUpperCase() }}
            </span>
          </td>
          <td class="border p-3 text-center space-x-2">
            <div
              class="flex flex-col justify-center sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
            >
              <button
                @click="previewFile(item)"
                class="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
              >
                <RiEyeLine />
              </button>

              <button
                @click="updateFile(item)"
                class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
              >
                <RiEdit2Line />
              </button>

              <button
                @click="deleteFile(item)"
                class="bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
              >
                <RiDeleteBin2Line />
              </button>
            </div>
          </td>
        </template>
      </DataTable>
      <!-- Data table -->

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
      <!-- Pagination Controls -->
      <!-- <div class="flex flex-wrap justify-center items-center space-x-2 mt-4">
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
      </div> -->
    </section>
  </div>
</template>
