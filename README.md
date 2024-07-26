# SozlukClone Frontend

SozlukClone is a frontend project that replicates the functionalities of the popular Turkish social media site "Ekşi Sözlük". This project is built using modern web technologies to ensure a responsive and interactive user experience.

## Disclaimer

**This project is not completed and is currently under development.**

## Screens

Home Page

![homepage](https://github.com/user-attachments/assets/44a1e6e7-9f63-4e0a-9e25-fce8b95b7712)

Profile

![profile](https://github.com/user-attachments/assets/9de1b9b8-58bd-4e4c-8353-c884452635d3)

Entry Input

![Ekran görüntüsü 2024-07-26 121153](https://github.com/user-attachments/assets/fa698aed-b639-45cc-8fbd-67b4c8f7c0ce)

Entry Page

![Ekran görüntüsü 2024-07-26 121244](https://github.com/user-attachments/assets/96e9d51d-7b6c-43d3-97c3-f20e2794f727)

Admin Panel - Site Settings

![globalsettings](https://github.com/user-attachments/assets/0be2ff2d-fbd6-428f-b83c-3e684e424c8c)

Admin Panel - Role Management

![rolemanagement](https://github.com/user-attachments/assets/53a58319-9fe8-4546-84bc-66e276478837)

Admin Panel - User Management

![Ekran görüntüsü 2024-07-26 120837](https://github.com/user-attachments/assets/aae0b268-7f24-45a7-bc99-165fa08883f8)


## Features

- Dark and Light themes based on system theme
- User authentication and authorization
- User Role Management
- Topic browsing and searching
- Entry posting and management
- Voting and commenting on entries
- User profiles and settings
- Users can follow each other


## Technologies Used

- **Next.js**: A React framework for production that makes it easy to build fast web applications with features like server-side rendering and static site generation.
- **Mantine UI**: A fully-featured React component library with a focus on usability, accessibility, and developer experience.

## Project Structure

The project is organized to follow best practices and ensure a modular architecture:

```sh
.
├── __tests__
│   └── Dashboard
├── app
│   ├── api
│   │   └── auth
│   │       └── [...nextauth]
│   ├── auth
│   │   ├── signin
│   │   └── signup
│   ├── baslik
│   │   └── [...slug]
│   ├── biri
│   │   └── [...slug]
│   ├── components
│   │   ├── Admin
│   │   │   └── dashboard
│   │   │       └── DashboardNavigation
│   │   ├── Auth
│   │   ├── Author
│   │   ├── Button
│   │   │   └── OTP
│   │   ├── ColorSchemeToggle
│   │   ├── Entry
│   │   ├── Header
│   │   │   └── BurgerMenu
│   │   ├── LeftFrame
│   │   ├── LoadingOverlay
│   │   └── Toaster
│   ├── tanim
│   │   ├── [...id]
│   │   └── guncelle
│   │       └── [...id]
│   └── yonetim
│       └── panel
├── public
│   └── assets
│       └── default
│           └── images
│               └── user
├── services
│   ├── apiError
│   ├── authService
│   ├── authorGroupOperationClaimsService
│   ├── authorGroupsService
│   ├── authorsService
│   ├── backendService
│   ├── entryService
│   ├── globalSettingsService
│   ├── operationClaimsService
│   ├── ratingsService
│   ├── relationsService
│   ├── titlesService
│   └── usersService
├── store
├── test-utils
├── types
│   └── DTOs
└── utils
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/SozlukClone-frontend.git
   cd SozlukClone-frontend
2. **Install dependencies:**
  ```sh
  npm install
  ```

3. **Run the development server:**
  ```sh
  npm run dev
  ```
Open http://localhost:3000 with your browser to see the result.

### Building for Production
To build the project for production, use the following command:

  ```sh
  npm run build
  ```

### Running Tests
To run the tests, use the following command:

  ```sh
  npm test
  ```

### Contributing
Contributions are welcome! Please open an issue or submit a pull request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

sql
Copy code

Feel free to copy and paste this into your README file!
