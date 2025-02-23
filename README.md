# Project Overview

## Description
This project is a comprehensive application designed to manage and streamline processes by integrating modern web technologies. The system employs a **VueJS**-powered frontend for an intuitive and dynamic user interface, a robust **Laravel API** backend for business logic, and **MySQL** as the database for reliable data storage. To ensure secure and scalable file management, **Synology NAS** is utilized as an SFTP storage solution.

## Features
- **Dynamic Frontend**: Built using VueJS to deliver a responsive and user-friendly experience.
- **API-Driven Backend**: Laravel API handles server-side logic and provides RESTful endpoints for seamless data communication.
- **Database Management**: MySQL serves as the relational database, ensuring structured and reliable data storage.
- **File Storage**: Synology NAS is used for secure file storage and retrieval via SFTP.

## Technologies Used
### Frontend
- VueJS

### Backend
- Laravel API

### Database
- MySQL

### File Storage
- Synology NAS (SFTP)

## Setup Instructions
### Prerequisites
- Node.js and npm installed
- PHP >= 8.0
- Composer
- MySQL server
- Synology NAS with SFTP configured

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   git clone https://github.com/rabucejojr/laravel-nas.git
   ```
 2. Navigate to the backend directory:
 ```bash
 cd laravel-nas
 ```
3. Install dependencies:
   ```bash
   composer install
   ```
4. Configure environment variables in `.env`:
   - Set database credentials for MySQL.
   - Configure SFTP settings for Synology NAS.
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

### Database
1. Set up a MySQL database.
2. Ensure database credentials are reflected in the backend `.env` file.

### File Storage
1. Configure Synology NAS with an SFTP server.
2. Update SFTP credentials in the backend `.env` file.

## Usage
1. Access the application through the frontend development server.
2. The frontend communicates with the Laravel API for backend operations.
3. Files are securely uploaded and managed via Synology NAS.

## Status
Currently work in progress

