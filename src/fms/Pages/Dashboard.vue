
<script setup>
import { ref, onMounted, computed } from 'vue';
import View from './View.vue';
import Upload from './Upload.vue';
import { RiEdit2Line,RiDeleteBin2Line,RiUpload2Line, RiEyeLine } from '@remixicon/vue';
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';

// Dummy stats data
const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
  recentUploads: 8,
  storageUsed: 25.6,
});

// Dummy recent files data
const recentFiles = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(recentFiles.value.length / pageSize.value));

// Modal state
const isModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const selectedFile = ref({});

// Open modal with file data
const viewFile = (file) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};

const deleteFile = (file) =>{
  // File Deletion
  console.log('file delete');
  selectedFile.value = file;
  isModalOpen.value = true;
};


// Placeholder functions for interactivity
const goToUpload = () => {
    console.log('upload clicked');
    isUploadModalOpen.value = true;
};

// // Fetch data from the JSON file on component mount
const fetchRecentFiles = async () => {
  try {
    const response = await fetch('/files.json'); 
    if (!response.ok) throw new Error('Failed to fetch recent files');
    recentFiles.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fetch data when the component is mounted
onMounted(fetchRecentFiles);


// Get the files for the current page
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return recentFiles.value.slice(start, end);
});

// Change the current page
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

</script>


<template>
<div class="dashboard p-6 bg-gray-100 min-h-screen">
    <!-- Dashboard Header -->
    <header class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
    </header>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
            <h2 class="text-lg font-medium">Total Files</h2>
            <p class="text-4xl font-bold">{{ stats.totalFiles }}</p>
        </Card>
        <Card bg="bg-green-500">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p class="text-4xl font-bold">{{ stats.totalUsers }}</p>
        </Card>
        <Card bg="bg-yellow-500">
            <h2 class="text-lg font-medium">Recent Uploads</h2>
            <p class="text-4xl font-bold">{{ stats.recentUploads }}</p>
        </Card>
        <Card bg="bg-red-500">
            <h2 class="text-lg font-medium">Storage Used</h2>
            <p class="text-4xl font-bold">{{ stats.storageUsed }} GB</p>
        </Card>
    </div>

    <!-- Recent Files Table -->
    <section class="recent-files bg-white p-6 rounded shadow ">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Files </h2>
        <Button
            @click="goToUpload"
            bg="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            <RiUpload2Line/>
            <!-- Upload File -->
        </Button>
    </div>
    <table class="w-full border-collapse">
        <thead>
        <tr class="bg-gray-200 text-gray-700">
            <th class="border p-3 text-left">File Name</th>
            <th class="border p-3 text-left">Uploaded By</th>
            <th class="border p-3 text-left">Date</th>
            <th class="border p-3 text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="file in paginatedFiles" :key="file.id" class="odd:bg-white even:bg-gray-50">
            <td class="border p-3">{{ file.name }}</td>
            <td class="border p-3">{{ file.uploadedBy }}</td>
            <td class="border p-3">{{ file.date }}</td>
            <td class="border p-3 text-center">
                <div class="flex justify-center space-x-2">
                    <Button
                        @click="viewFile(file)"
                        bg="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                        >
                        <RiEyeLine/>
                    </Button>
                    <Button
                        @click="viewFile(file)"
                        bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                        <RiEdit2Line/>
                    </Button>
                    <Button
                        @click="deleteFile(file)"
                        bg="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                        >
                        <RiDeleteBin2Line/>
                    </Button>
                </div>
            </td>
        </tr>
        </tbody>
    </table>

        <!-- Pagination -->
    <div class="flex justify-center items-center space-x-2 mt-4">
      <button
        class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
        class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <View
      :isOpen="isModalOpen"
      :file="selectedFile"
      @close="isModalOpen = false"
    />

    <Upload
      :isOpen="isUploadModalOpen"
      @close="isUploadModalOpen = false"
    />

    </section>
</div>
</template>
