<script setup>
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Header from "@/components/Header.vue";
import AddDocument from "./AddDocument.vue";
import Update from "@/dms/Pages/Update.vue";
import { RiEdit2Line, RiEyeLine, RiAddLine } from "@remixicon/vue";
import Preview from "@/dms/Pages/Preview.vue";
import { ref, onMounted, computed } from "vue";
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
const selectedFile = ref({});
const recentDocuments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");

// Computed properties for filtering and paginating files
const filteredDocuments = computed(() => {
  if (!Array.isArray(recentDocuments.value)) return [];

  // Filter files based on search query across multiple fields
  const query = searchQuery.value.toLowerCase();
  return recentDocuments.value.filter((document) => {
    return document.filename?.toLowerCase().includes(query);
  });
});

// Calculate total number of pages based on filtered results
const totalPages = computed(() =>
  Math.ceil(filteredDocuments.value.length / pageSize.value)
);

// Get current page of files based on pagination settings
const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredDocuments.value.slice(start, end);
});

// Navigation methods for pagination
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
  }
};

const handleAddDocumentComplement = async (success) => {
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

const API = import.meta.env.VITE_API;

const fetchRecentDocuments = async () => {
  try {
    const response = await fetch(`${API}/document`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    recentDocuments.value = data.files || [];
  } catch (error) {
    console.error("Error fetching recent files:", error.message || error);
    recentDocuments.value = [];
  }
};

// Dummy static data
const documents = ref([
  {
    id: 1,
    trackingNumber: "TRK-20240227-001",
    subject: "Project Proposal Submission",
    title: "AI-Driven Solutions for Local Governance",
    status: "Processing",
    date_uploaded: "2025-02-25",
    deadline: "2025-03-10",
  },
  {
    id: 2,
    trackingNumber: "TRK-20240227-002",
    subject: "Budget Approval Request",
    title: "Q2 Budget Allocation for R&D",
    status: "Received",
    date_uploaded: "2025-02-26",
    deadline: "2025-03-15",
  },
  {
    id: 3,
    trackingNumber: "TRK-20240227-003",
    subject: "Research Findings Submission",
    title: "Climate Change Impact on Agriculture",
    status: "Approved",
    date_uploaded: "2025-02-27",
    deadline: "2025-03-20",
  },
]);

// Open upload modal
const documentUpload = () => {
  isAddDocumentModalOpen.value = true;
};
// Modal action handlers for file operations
const updateFile = (data) => {
  selectedFile.value = data;
  isEditModalOpen.value = true;
};

const previewFile = (data) => {
  selectedFile.value = data;
  isPreviewModalOpen.value = true;
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
          @click="documentUpload"
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
              <th class="border p-2">ID</th>
              <th class="border p-2">Tracking Number</th>
              <th class="border p-2">Title</th>
              <th class="border p-2">Subject</th>
              <th class="border p-2">Status</th>
              <th class="border p-2">Date Uploaded</th>
              <th class="border p-2">Deadline</th>
              <th class="border p-2 text-center">Action</th>
            </tr>
          </thead>

          <!-- Table Body with File Rows -->
          <tbody>
            <tr
              v-for="data in paginatedDocuments"
              :key="data.id"
              class="odd:bg-white even:bg-gray-100 text-center"
            >
              <td class="border p-2">{{ data.id }}</td>
              <td class="border p-2">{{ data.trackingNumber }}</td>
              <td class="border p-2">{{ data.title }}</td>
              <td class="border p-2">{{ data.subject }}</td>
              <td class="border p-2">
                <span
                  :class="{
                    'text-yellow-600': data.status === 'Pending',
                    'text-green-600': data.status === 'Approved',
                    'text-red-600': data.status === 'Rejected',
                  }"
                >
                  {{ data.status }}
                </span>
              </td>
              <td class="border p-2">{{ data.date_uploaded }}</td>

              <td class="border p-2">{{ data.deadline }}</td>
              <td class="border p-2 text-center space-x-2">
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
          :fetchRecentFiles="fetchRecentDocuments"
        />

        <Preview
          :isOpen="isPreviewModalOpen"
          :data="selectedFile"
          @close="isPreviewModalOpen = false"
        />

        <AddDocument
          :isOpen="isAddDocumentModalOpen"
          @close="isAddDocumentModalOpen = false"
          @add-complete="handleAddDocumentComplement"
          :fetchRecentFiles="fetchRecentDocuments"
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
