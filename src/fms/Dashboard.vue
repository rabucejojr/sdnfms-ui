
<script setup>
import { ref, onMounted } from 'vue';
import View from './View.vue';
import Upload from './Upload.vue';

// Dummy stats data
const stats = ref({
  totalFiles: 120,
  totalUsers: 15,
  recentUploads: 8,
  storageUsed: 25.6,
});

// Dummy recent files data
const recentFiles = ref([
  { id: 1, name: 'Project Plan.pdf', uploadedBy: 'John Doe', date: '2024-11-20' },
  { id: 2, name: 'Budget.xlsx', uploadedBy: 'Jane Smith', date: '2024-11-19' },
  { id: 3, name: 'Presentation.pptx', uploadedBy: 'Alice Johnson', date: '2024-11-18' },
  { id: 4, name: 'Notes.txt', uploadedBy: 'Michael Brown', date: '2024-11-17' },
  { id: 5, name: 'Contract.docx', uploadedBy: 'Sarah Lee', date: '2024-11-16' },
]);

// Modal state
const isModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const selectedFile = ref({});

// Open modal with file data
const viewFile = (file) => {
  selectedFile.value = file;
  isModalOpen.value = true;
};


// Placeholder functions for interactivity
const goToUpload = () => {
    console.log('upload clicked');
    isUploadModalOpen.value = true;
};

// const viewFile = (fileId) => {
//   alert(`Viewing file with ID: ${fileId}`);
// };

// Fetch data (dummy fetch for now)
const fetchDashboardData = async () => {
  // Replace this with an actual API call in production
  console.log('Fetching data... Dummy data already loaded.');
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>


<template>
<div class="dashboard p-6 bg-gray-100 min-h-screen">
    <!-- Dashboard Header -->
    <header class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
    <button
        @click="goToUpload"
        class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
    >
        Upload File
    </button>
    </header>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <div class="stat-card bg-blue-500 text-white p-4 rounded shadow">
        <h2 class="text-lg font-medium">Total Files</h2>
        <p class="text-4xl font-bold">{{ stats.totalFiles }}</p>
    </div>
    <div class="stat-card bg-green-500 text-white p-4 rounded shadow">
        <h2 class="text-lg font-medium">Total Users</h2>
        <p class="text-4xl font-bold">{{ stats.totalUsers }}</p>
    </div>
    <div class="stat-card bg-yellow-500 text-white p-4 rounded shadow">
        <h2 class="text-lg font-medium">Recent Uploads</h2>
        <p class="text-4xl font-bold">{{ stats.recentUploads }}</p>
    </div>
    <div class="stat-card bg-red-500 text-white p-4 rounded shadow">
        <h2 class="text-lg font-medium">Storage Used</h2>
        <p class="text-4xl font-bold">{{ stats.storageUsed }} GB</p>
    </div>
    </div>

    <!-- Recent Files Table -->
    <section class="recent-files bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Recent Files</h2>
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
        <tr v-for="file in recentFiles" :key="file.id" class="odd:bg-white even:bg-gray-50">
            <td class="border p-3">{{ file.name }}</td>
            <td class="border p-3">{{ file.uploadedBy }}</td>
            <td class="border p-3">{{ file.date }}</td>
            <td class="border p-3 text-center">
                <div class="flex justify-center space-x-2">
                    <button
                        @click="viewFile(file)"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                        Edit
                    </button>
                    <button
                        @click="viewFile(file)"
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
        </tbody>
    </table>

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
