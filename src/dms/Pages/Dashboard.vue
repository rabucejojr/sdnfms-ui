<script setup>
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Header from "@/components/Header.vue";
import { ref } from "vue";
import AddDocument from "./AddDocument.vue";
import { RiEdit2Line, RiDeleteBin2Line, RiEyeLine, RiAddLine } from "@remixicon/vue";
// Define component props
defineProps({
  padding: {
    type: String,
    default: "mt-2",
  },
});

const isAddDocumentModalOpen = ref(false);

const handleAddDocumentComplement = async (success) => {
  console.log("Clicked");
};

const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
});

const fetchRecentFiles = async () => {
  console.log("Fetch Files Clicked");
};

// Dummy static data
const documents = ref([
  {
    id: 1,
    trackingNumber: "TRK-20240225-001",
    title: "Project Proposal",
    personnel: "John Doe",
    dateAdded: "2024-02-25",
    deadline: "2024-03-10",
    status: "Pending",
  },
  {
    id: 2,
    trackingNumber: "TRK-20240225-002",
    title: "Budget Report",
    personnel: "Jane Smith",
    dateAdded: "2024-02-20",
    deadline: "2024-03-05",
    status: "Approved",
  },
  {
    id: 3,
    trackingNumber: "TRK-20240225-003",
    title: "Meeting Minutes",
    personnel: "Bob Johnson",
    dateAdded: "2024-02-18",
    deadline: "2024-03-01",
    status: "Rejected",
  },
]);

// Open upload modal
const documentUpload = () => {
  isAddDocumentModalOpen.value = true;
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
              <th class="border p-2">Concern Personnel</th>
              <th class="border p-2">Date Added</th>
              <th class="border p-2">Deadline</th>
              <th class="border p-2">Status</th>
              <th class="border p-2 text-center">Action</th>
            </tr>
          </thead>

          <!-- Table Body with File Rows -->
          <tbody>
            <tr
              v-for="doc in documents"
              :key="doc.id"
              class="odd:bg-white even:bg-gray-100 text-center"
            >
              <td class="border p-2">{{ doc.id }}</td>
              <td class="border p-2">{{ doc.trackingNumber }}</td>
              <td class="border p-2">{{ doc.title }}</td>
              <td class="border p-2">{{ doc.personnel }}</td>
              <td class="border p-2">{{ doc.dateAdded }}</td>
              <td class="border p-2">{{ doc.deadline }}</td>
              <td class="border p-2">
                <span
                  :class="{
                    'text-yellow-600': doc.status === 'Pending',
                    'text-green-600': doc.status === 'Approved',
                    'text-red-600': doc.status === 'Rejected',
                  }"
                >
                  {{ doc.status }}
                </span>
              </td>
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
        <AddDocument
          :isOpen="isAddDocumentModalOpen"
          @close="isAddDocumentModalOpen = false"
          @add-complete="handleAddDocumentComplement"
          :fetchRecentFiles="fetchRecentFiles"
        />
      </div>
    </section>
  </div>
</template>
