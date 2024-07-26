# SozlukClone Frontend

SozlukClone is a frontend project that replicates the functionalities of the popular Turkish social media site "Ekşi Sözlük". This project is built using modern web technologies to ensure a responsive and interactive user experience.

## Disclaimer

**This project is not completed and is currently under development.**

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

## Features

- User authentication and authorization
- Topic browsing and searching
- Entry posting and management
- Voting and commenting on entries
- User profiles and settings
- Users can follow each other


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
