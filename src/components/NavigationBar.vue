<template>
  <nav class="bg-gray-100 pt-3 pl-3 shadow-lg text-black">
    <div
      class="px-0 mx-auto flex flex-col md:flex-row justify-between items-center lg:space-y-2 lg:px-4"
    >
      <ul class="flex space-x-4">
        <li>
          <router-link to="/main" class="hover:underline">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/home" class="hover:underline">File Repository</router-link>
        </li>
        <li>
          <router-link to="/dms" class="hover:underline">Document Tracking</router-link>
        </li>
        <li>
          <router-link to="/" class="hover:underline">Meet The Team</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup></script>
