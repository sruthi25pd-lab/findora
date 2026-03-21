# Find Alert Team - Application Specification

## 1. Project Overview
"Find Alert Team" is a comprehensive web application designed to help communities quickly report, locate, and recover missing people, pets, and objects. The platform connects users who have lost someone or something with a broader community that can assist in the search, featuring real-time alerts and interactive map views.

## 2. Target Audience
- **General Users**: Individuals looking to report missing persons/pets/objects or those willing to help find them in their local area.
- **Administrators**: Platform managers responsible for verifying reports, moderating content, and managing users to ensure platform integrity.

---

## 3. Features & Requirements

### 3.1 User Features
- **Authentication**: Secure user registration, login, and profile management.
- **Reporting System**: Ability to create a detailed missing report including:
  - Subject category (Person, Pet, Object)
  - Images (up to 5 photos)
  - Detailed description (physical traits, distinguishing marks)
  - Date and time last seen
  - Specific location details (address, coordinates)
- **Search & Filtering**: Advanced search capabilities to filter reports by category, location radius, date range, and status (Lost, Found).
- **Real-Time Alerts**: Push notifications and in-app alerts sent to users within a specific radius of a newly reported missing entity.
- **Interactive Map View**: A localized map displaying markers for current missing reports, color-coded by category or urgency.
- **Comment/Tip System**: Ability for other users to leave tips or sightings on active reports.

### 3.2 Admin Features
- **Report Verification**: Tools to review and verify newly submitted reports before they go fully public (or instantly public with an "Unverified" tag).
- **Content Moderation**: Ability to flag, hide, or permanently remove fake, inappropriate, or resolved reports.
- **User Management**: Dashboard to view all registered users, issue warnings, suspend, or ban accounts violating terms of service.
- **Analytics Dashboard**: Overview of app usage, report resolution rate, and active alerts.

---

## 4. Database Schema

### 4.1 Users Table (`users`)
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the user |
| `email` | String | Unique, Not Null | User's email address |
| `password_hash` | String | Not Null | Encrypted password |
| `full_name` | String | Not Null | User's full name |
| `phone_number` | String | Nullable | Contact number for urgent alerts |
| `role` | Enum | Default 'user' | 'user' or 'admin' |
| `created_at` | Timestamp | Not Null | Account creation date |

### 4.2 Reports Table (`reports`)
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the report |
| `user_id` | UUID | Foreign Key | ID of the reporting user |
| `type` | Enum | Not Null | 'person', 'pet', 'object' |
| `title` | String | Not Null | Brief title (e.g., "Missing Golden Retriever") |
| `description` | Text | Not Null | Detailed physical description and context |
| `image_urls` | Array[String] | Nullable | Links to uploaded images |
| `last_seen_loc` | Point (JSON)| Not Null | Lat/Lng coordinates and address string |
| `last_seen_date`| Timestamp | Not Null | When the entity was last seen |
| `status` | Enum | Default 'active' | 'active', 'resolved', 'fake' |
| `is_verified` | Boolean | Default false | Admin moderation status |
| `created_at` | Timestamp | Not Null | Report submission date |

### 4.3 Alerts/Notifications Table (`alerts`)
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the alert |
| `user_id` | UUID | Foreign Key | Target user receiving the alert |
| `report_id` | UUID | Foreign Key | Associated missing report |
| `message` | String | Not Null | Short notification text |
| `is_read` | Boolean | Default false | Read status |
| `created_at` | Timestamp | Not Null | Alert generation date |

---

## 5. Technical Architecture

### 5.1 Tech Stack Recommendation
- **Frontend**: Next.js (React) or Vite + React
- **Styling**: Vanilla CSS, Tailwind CSS, or component library (Material-UI/Chakra UI)
- **Backend / API**: Node.js with Express, or Next.js API Routes
- **Database**: PostgreSQL (Relational mapping fits well for reporting)
- **Maps**: Google Maps API or Mapbox
- **Images**: AWS S3 or Cloudinary

### 5.2 Beginner-Friendly Explanation
Think of this application like a highly specialized digital bulletin board combined with a neighborhood watch.
1. The **Frontend** (what the user sees) is the bulletin board. It shows the posters (cards/maps) of missing things.
2. The **Backend API** is the post office clerk. When a user creates a new missing poster, they hand it to the clerk.
3. The **Database** is the filing cabinet where the clerk safely stores all the details of the posters, as well as who submitted them.
4. When a new poster goes into the filing cabinet, the clerk (API) automatically sends out a megaphone announcement (**Alerts**) to everyone nearby.

### 5.3 Proposed Folder Structure
```text
find-alert-team/
├── src/
│   ├── components/       # Reusable UI elements (Buttons, Cards, Modals)
│   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   ├── reports/      # ReportCard, ReportForm
│   │   └── map/          # MapView, MapMarker
│   ├── pages/            # Application routes/screens
│   │   ├── index.tsx     # Homepage / Landing
│   │   ├── login.tsx     # Auth: Login
│   │   ├── register.tsx  # Auth: Register
│   │   ├── reports/      # Missing Reports list and details
│   │   └── admin/        # Admin dashboard pages
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useLocation)
│   ├── services/         # API call wrappers (e.g., api.js)
│   ├── utils/            # Helper functions (e.g., formatting dates, validation)
│   └── styles/           # Global CSS and variables
├── public/               # Static assets (images, icons)
├── server/               # (If using separate Express backend)
│   ├── controllers/      # Logic for API endpoints
│   ├── models/           # Database schemas
│   ├── routes/           # API route definitions
│   └── middleware/       # Auth guards, error handlers
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

### 5.4 API Structure (RESTful approach)

*Note: All endpoints returning sensitive or modification data require Authentication headers.*

**Users (`/api/users`)**
- `POST /api/users/register` - Create a new user account.
- `POST /api/users/login` - Authenticate user and return token.
- `GET /api/users/profile` - Get logged-in user's profile details.
- `GET /api/users` - (Admin only) Get a list of all users.

**Reports (`/api/reports`)**
- `GET /api/reports` - Fetch a list of active reports (supports query params like `?type=pet&radius=10km`).
- `GET /api/reports/:id` - Fetch details of a specific report.
- `POST /api/reports` - Create a new missing report.
- `PUT /api/reports/:id` - Update report details or status (e.g., mark as "found").
- `DELETE /api/reports/:id` - (Admin only) Remove a fake/malicious report.

**Alerts (`/api/alerts`)**
- `GET /api/alerts` - Fetch notifications for the currently logged-in user.
- `PUT /api/alerts/:id/read` - Mark a specific alert as read.
