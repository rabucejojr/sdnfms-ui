<script setup>
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Header from "@/components/Header.vue";
import AddDocument from "./AddDocument.vue";
import Update from "@/dms/Pages/Update.vue";
import { RiEdit2Line, RiEyeLine, RiAddLine } from "@remixicon/vue";
import Preview from "@/dms/Pages/Preview.vue";
import { ref, onMounted, computed } from "vue";
import SearchComponent from "@/components/SearchComponent.vue";
import DataTable from "@/components/DataTable.vue";

// Define component props
defineProps({
  padding: {
    type: String,
    default: "mt-2",
  },
});

const isAddDocumentModalOpen = ref(false);
const isPreviewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedDocument = ref({});
const recentDocuments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");

//api call
const API = import.meta.env.VITE_API;

// Computed properties for filtering and paginating files
const filteredDocuments = computed(() => {
  if (!Array.isArray(recentDocuments.value)) return [];

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return recentDocuments.value; // Return all if no search query

  return recentDocuments.value.filter((doc) =>
    ["filename", "tracking_number", "title", "subject"].some((key) =>
      doc[key]?.toLowerCase().includes(query)
    )
  );
});

// Store filtered length in a computed property to avoid redundant calculations
const totalFilteredDocuments = computed(() => filteredDocuments.value.length);

// Calculate total pages efficiently
const totalPages = computed(() =>
  Math.ceil(totalFilteredDocuments.value / pageSize.value)
);

// Get current page of documents
const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredDocuments.value.slice(start, start + pageSize.value);
});

// Pagination navigation
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Fetch documents from API
const fetchRecentDocuments = async () => {
  try {
    const response = await fetch(`${API}/document`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    recentDocuments.value = data?.documents ?? [];
  } catch (error) {
    console.error("Error fetching documents:", error.message || error);
    recentDocuments.value = [];
  }
};

const handleAddDocumentComplete = async (success) => {
  if (success) {
    // Close upload modal
    isAddDocumentModalOpen.value = false;

    // Refresh file list from server
    setTimeout(() => {
      fetchRecentDocuments();
    }, 500);
  }
};

const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
});

// Open upload modal
const documentUpload = () => {
  isAddDocumentModalOpen.value = true;
};
// Modal action handlers for file operations
const updateFile = (data) => {
  selectedDocument.value = data;
  isEditModalOpen.value = true;
};

const previewFile = (data) => {
  selectedDocument.value = data;
  isPreviewModalOpen.value = true;
};

const query = (query) => {
  searchQuery.value = query;
};

// Fetch initial data when component mounts
onMounted(fetchRecentDocuments);
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
        <!-- Search Input with Icon -->
        <SearchComponent
          :searchQuery="query"
          api-endpoint="document/search"
          placeholder="Trace Document Here..."
        />

        <!-- Upload Button -->
        <Button
          @click="documentUpload"
          bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <span>Add Document</span>
          <RiAddLine />
        </Button>
      </div>

      <!-- Data table with pagination for documents -->
      <DataTable
        :items="paginatedDocuments"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :goToPage="goToPage"
      >
        <!-- Table Headers -->
        <template #header>
          <th class="border p-2 text-center">ID</th>
          <th class="border p-2 text-center">Tracking Number</th>
          <th class="border p-2 text-center">Title</th>
          <th class="border p-2 text-center">Subject</th>
          <th class="border p-2 text-center">Status</th>
          <th class="border p-2 text-center">Date Uploaded</th>
          <th class="border p-2 text-center">Deadline</th>
          <th class="border p-2 text-center">Action</th>
        </template>

        <!-- Table Rows -->
        <template #row="{ item }">
          <td class="border p-2 text-center">{{ item.id }}</td>
          <td class="border p-2 text-center">{{ item.tracking_number }}</td>
          <td class="border p-2 text-center">{{ item.title }}</td>
          <td class="border p-2 text-center">{{ item.subject }}</td>
          <td class="border p-2 text-center">
            <span
              class="px-4 py-2 text-sm font-semibold rounded-lg"
              :class="{
                'bg-green-200 text-green-800': item.status === 'Approved',
                'bg-yellow-200 text-yellow-800': item.status === 'Processing',
                'bg-blue-200 text-blue-800': item.status === 'Received',
                'bg-red-200 text-red-800': item.status === 'Released',
                'bg-gray-200 text-gray-800': ![
                  'Approved',
                  'Processing',
                  'Received',
                  'Released',
                ].includes(item.status),
              }"
            >
              {{ item.status }}
            </span>
          </td>
          <td class="border p-2 text-center">{{ item.date_uploaded }}</td>
          <td class="border p-2 text-center">{{ item.deadline }}</td>
          <td class="border p-2 text-center space-x-2">
            <div
              class="flex flex-col justify-center sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"
            >
              <div class="items-center">
                <Button
                  @click="previewFile(item)"
                  bg="bg-green-500 hover:bg-green-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
                >
                  <RiEyeLine />
                </Button>
              </div>

              <Button
                @click="updateFile(item)"
                bg="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto flex justify-center items-center"
              >
                <RiEdit2Line />
              </Button>
            </div>
          </td>
        </template>
      </DataTable>
      <!-- Data table -->

      <!-- Modal Components -->
      <Update
        :isOpen="isEditModalOpen"
        :data="selectedDocument"
        @close="isEditModalOpen = false"
        :fetchRecentDocuments="fetchRecentDocuments"
      />

      <Preview
        :isOpen="isPreviewModalOpen"
        :data="selectedDocument"
        @close="isPreviewModalOpen = false"
      />

      <AddDocument
        :isOpen="isAddDocumentModalOpen"
        @close="isAddDocumentModalOpen = false"
        @add-complete="handleAddDocumentComplete"
        :fetchRecentDocuments="fetchRecentDocuments"
      />
    </section>
  </div>
</template>
