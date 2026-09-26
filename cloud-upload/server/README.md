# CloudStorage NodeJS — Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Models](#5-database-models)
6. [Authentication Flow](#6-authentication-flow)
7. [Session Management](#7-session-management)
8. [File Management Flow](#8-file-management-flow)
9. [API Endpoints](#9-api-endpoints)
10. [Middleware](#10-middleware)
11. [Utilities](#11-utilities)
12. [Security Implementation](#12-security-implementation)
13. [Activity Logging](#13-activity-logging)
14. [Error Handling](#14-error-handling)
15. [Multi Device Login](#15-multi-device-login)

---

## 1. Project Overview

CloudStorage is a backend REST API built with Node.js and Express. It allows users to register, login, upload files to Cloudinary, manage their files, and logout securely.

### Core Features
- JWT based authentication (Access Token + Refresh Token)
- Secure session management per device
- File upload, retrieval, and deletion via Cloudinary
- Activity logging for all auth events
- Multi device login control via environment flag
- Cursor based pagination with search and filter for file listing

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Cloud file storage |
| **Multer** | File upload handling |
| **Zod** | Request validation |
| **cookie-parser** | Reading HttpOnly cookies |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variables |

---

## 3. Folder Structure

```
server/
 ├── config/
 │    ├── cloudinary.js         ← Cloudinary SDK setup
 │    ├── jwtConfig.js          ← JWT secrets and expiry config
 │    └── multer.js             ← Multer memory storage + file filter
 │
 ├── controllers/
 │    ├── loginController.js       ← Login logic
 │    ├── registrationControllers.js ← Register logic
 │    ├── logOutController.js      ← Logout logic
 │    ├── refreshTokenController.js ← Token rotation logic
 │    └── fileController.js        ← Upload, get, delete files
 │
 ├── middleware/
 │    ├── authMiddleware.js     ← Verify JWT + session check
 │    └── validate.js           ← Zod validation middleware
 │
 ├── models/
 │    ├── user.model.js         ← User schema
 │    ├── session.model.js      ← Session schema
 │    ├── activityLog.model.js  ← Activity log schema
 │    └── file.model.js         ← File schema
 │
 ├── routes/
 │    ├── user.routes.js        ← Auth routes
 │    └── file.routes.js        ← File routes
 │
 ├── utils/
 │    ├── apiError.js           ← Custom error class
 │    ├── apiResponse.js        ← Consistent response format
 │    ├── generateAccessToken.js ← Create access token
 │    ├── generateRefreshToken.js ← Create refresh token
 │    └── logActivity.js        ← Activity log helper
 │
 ├── validators/
 │    └── auth.validator.js     ← Zod schemas for auth routes
 │
 ├── app.js                     ← Express app configuration
 ├── index.js                   ← Entry point, DB connect, server start
 └── constant.js                ← App constants (DB_NAME etc)
```

---

## 4. Environment Variables

```
# Server
PORT=8000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://...
DB_NAME=cloudStorage

# JWT Access Token
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1h

# JWT Refresh Token
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Config
FILES_PER_PAGE=10
MULTIDEVICE_LOGIN=1       ← 1 = allow, 0 = block
FRONTEND_URL=http://localhost:5173
```

---

## 5. Database Models

### User Model
```
User {
  username      String  required
  email         String  required, unique
  password      String  required (bcrypt hashed)
  role          String  enum: ["user", "admin"], default: "user"
  createdAt     Date    auto
  updatedAt     Date    auto
}
```

### Session Model
```
Session {
  userId        ObjectId  ref: User, required
  refreshToken  String    required (unique per device)
  ip            String    required
  userAgent     String    required (device identifier)
  isValid       Boolean   default: true
  loginTime     Date      default: now
  lastActive    Date      updated on every request
  expiresAt     Date      7 days from login (TTL index — auto delete)
  createdAt     Date      auto
  updatedAt     Date      auto
}
```

TTL Index — MongoDB automatically deletes expired sessions:
```js
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### ActivityLog Model
```
ActivityLog {
  userId      ObjectId  ref: User
  action      String    enum: ["login", "logout", "refresh_token",
                               "failed_login", "register",
                               "password_change", "failed_auth"]
  status      String    enum: ["success", "failed"]
  ip          String
  userAgent   String
  details     String    extra info (e.g. "Invalid password")
  timestamp   Date      default: now (TTL — auto delete after 90 days)
}
```

### File Model
```
File {
  originalName   String    required (photo.jpg)
  storedName     String    required (cloudinary public_id)
  fileUrl        String    required (cloudinary secure_url)
  fileType       String    required (image/jpeg, application/pdf)
  fileSize       Number    required (bytes)
  cloudPublicId  String    required (for deletion from cloudinary)
  owner          ObjectId  ref: User, required
  createdAt      Date      auto
  updatedAt      Date      auto
}
```

---

## 6. Authentication Flow

### Registration Flow
```
POST /api/auth/register
  → Validate request body (Zod)
  → Check email not already registered
  → Hash password (bcrypt)
  → Create user in DB
  → Log activity (register, success)
  → Send success response
```

### Login Flow
```
POST /api/auth/login
  → Validate request body (Zod)
  → Find user by email
  → Compare password (bcrypt)
  → Check existing session (multi device logic)
  → Generate Access Token (JWT, 1hr, contains userId + email + role)
  → Generate Refresh Token (JWT, 7days, contains userId only)
  → Create Session in DB (userId, refreshToken, ip, userAgent)
  → Set Refresh Token in HttpOnly cookie
  → Log activity (login, success)
  → Send Access Token in response body
```

### Logout Flow
```
POST /api/auth/logout  (protected)
  → Read refreshToken from HttpOnly cookie
  → Delete session from DB (only this device session)
  → Clear HttpOnly cookie
  → Log activity (logout, success)
  → Send success response
```

### Refresh Token Flow
```
POST /api/auth/refresh
  → Read refreshToken from HttpOnly cookie
  → Verify refresh token signature (REFRESH_TOKEN_SECRET)
  → Find session in DB (userId + refreshToken + isValid: true)
  → Generate new Access Token
  → Generate new Refresh Token (rotation)
  → Update session in DB (new refreshToken + lastActive + expiresAt)
  → Set new Refresh Token in HttpOnly cookie
  → Send new Access Token in response body
```

### Token Details

| | Access Token | Refresh Token |
|---|---|---|
| **Payload** | userId, email, role | userId only |
| **Secret** | ACCESS_TOKEN_SECRET | REFRESH_TOKEN_SECRET |
| **Expiry** | 1 hour | 7 days |
| **Stored in** | Redux/memory (frontend) | HttpOnly Cookie |
| **Sent with** | Every request header | Only to /refresh |
| **Saved in DB** | No | Yes (in Session) |

---

## 7. Session Management

### How sessions work
```
Each device login → creates unique session in DB
  Session identified by → userId + refreshToken + userAgent

Same device login again → old session deleted, new one created
Different device login → new session created (if MULTIDEVICE_LOGIN=1)
                      → blocked (if MULTIDEVICE_LOGIN=0)

Logout → deletes only current device session
Session expires → MongoDB TTL auto deletes after 7 days
```

### Multi Device Login Logic (in Login Controller)
```
MULTIDEVICE_LOGIN=0 (single device):
  → Existing session found → throw 403 "Already logged in"

MULTIDEVICE_LOGIN=1 (multi device):
  → Same device (same userAgent) → delete old session, create new
  → Different device → create new session alongside existing
```

### Force Login Flow (when user chooses to logout previous device)
```
POST /api/auth/force-login
  → Delete all existing sessions for userId
  → Create new session for current device
  → Generate new tokens
  → Send response
```

---

## 8. File Management Flow

### Upload Flow
```
POST /api/files/upload  (protected)
  → isAuthenticated middleware
  → Multer processes file (memory storage, 5MB limit, type check)
  → Upload buffer to Cloudinary (folder: cloud-upload)
  → Save file metadata in DB (owner: req.user._id)
  → Send file data in response
```

### Get Files Flow (Cursor Pagination + Search + Filter)
```
GET /api/files  (protected)
  Query params:
    cursor  → last file ID from previous response
    search  → search by file name
    type    → filter by file type (image, pdf etc)
    sortBy  → field to sort by (default: createdAt)
    order   → asc or desc (default: desc)

  → Build filter object (owner + search + type + cursor)
  → Query DB with sort + skip + limit+1
  → Check hasMore (fetched limit+1 files)
  → Return files + nextCursor + hasMore
```

### Delete Flow
```
DELETE /api/files/:id  (protected)
  → Find file by ID in DB
  → Verify file owner === req.user._id
  → Delete from Cloudinary (using cloudPublicId)
  → Delete from DB
  → Send success response
```

### Multer Config (config/multer.js)
```
Storage    → Memory (buffer sent directly to Cloudinary)
Max size   → 5MB
Allowed types:
  - image/jpeg
  - image/png
  - image/gif
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - application/vnd.ms-excel
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

---

## 9. API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, get tokens |
| POST | `/logout` | Yes | Logout current device |
| POST | `/refresh` | No | Get new access token |
| GET | `/dashboard` | Yes | Test protected route |

### File Routes — `/api/files`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all files (paginated) |
| POST | `/upload` | Yes | Upload a file |
| DELETE | `/:id` | Yes | Delete a file |

### Query Parameters for GET /api/files

| Param | Type | Default | Description |
|---|---|---|---|
| `cursor` | String | null | Last file ID for pagination |
| `search` | String | "" | Search by file name |
| `type` | String | "" | Filter by file type |
| `sortBy` | String | createdAt | Sort field |
| `order` | String | desc | asc or desc |

### Response Format

**Success:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "success": false
}
```

---

## 10. Middleware

### authMiddleware.js
```
Every protected request passes through this:

Step 1 → Check Authorization header exists
Step 2 → Extract Bearer token
Step 3 → Verify access token (signature + expiry)
Step 4 → Find user in DB by decoded.userId
Step 5 → Find valid session in DB (userId + refreshToken + isValid: true)
Step 6 → Attach user to req.user
Step 7 → next()

Errors thrown:
  401 → No token
  401 → Token expired
  401 → Invalid token
  401 → User not found
  401 → Session invalid or expired
```

### validate.js (Zod)
```
Wraps Zod schema validation as Express middleware:
  → Parse req.body against schema
  → If invalid → throw ApiError(400, first error message)
  → If valid → next()
```

---

## 11. Utilities

### ApiError
Custom error class extending Error:
```
new ApiError(statusCode, message)
  → statusCode: HTTP status
  → message: error description
  → success: false
```

### ApiResponse
Consistent success response format:
```
new ApiResponse(statusCode, message, data)
  → statusCode: HTTP status
  → message: success description
  → data: response payload
  → success: true
```

### generateAccessToken
```
generateAccessToken(userId, email, role)
  → Signs JWT with ACCESS_TOKEN_SECRET
  → Expiry from ACCESS_TOKEN_EXPIRY env
  → Returns token string
```

### generateRefreshToken
```
generateRefreshToken(userId)
  → Signs JWT with REFRESH_TOKEN_SECRET
  → Expiry from REFRESH_TOKEN_EXPIRY env
  → Returns token string
```

### logActivity
```
logActivity({ userId, action, status, ip, userAgent, details })
  → Creates ActivityLog document in DB
  → Wrapped in try/catch — never crashes main app if logging fails
```

---

## 12. Security Implementation

### Password Security
```
bcrypt hash with salt rounds: 10
Password never stored in plain text
Password excluded from DB queries using .select("-password")
```

### JWT Security
```
Two separate secrets:
  ACCESS_TOKEN_SECRET  → for access tokens only
  REFRESH_TOKEN_SECRET → for refresh tokens only

If one secret compromised → other tokens still safe
```

### Cookie Security
```
refreshToken cookie settings:
  httpOnly: true    → JS cannot access it (XSS safe)
  secure: true      → HTTPS only (in production)
  sameSite: lax     → CSRF protection
  maxAge: 7 days    → auto expires
```

### Input Validation (Zod)
```
All auth routes validated before reaching controller:
  email   → must be valid email format
  password → minimum 6 characters
  username → minimum 3 characters
  role    → enum ["user", "admin"]
```

### File Security
```
File ownership verified before deletion:
  file.owner.toString() === req.user._id.toString()

Multer limits:
  File size → 5MB max
  File types → whitelist only
```

---

## 13. Activity Logging

All auth events logged to ActivityLog collection:

| Event | Action | Status |
|---|---|---|
| Successful registration | register | success |
| Successful login | login | success |
| Failed login | failed_login | failed |
| Logout | logout | success |
| Token refresh | refresh_token | success |

Each log contains:
```
userId    → who did it
action    → what happened
status    → success or failed
ip        → where from
userAgent → which device/browser
details   → extra info if needed
timestamp → when (auto deleted after 90 days)
```

---

## 14. Error Handling

### Global Error Handler (app.js)
```
All errors thrown anywhere in the app flow here:
  → Logs error to console (server side)
  → Reads statusCode and message
  → Sends consistent JSON error response

JWT specific errors handled:
  TokenExpiredError  → 401 Token expired
  JsonWebTokenError  → 401 Invalid token
```

### Error flow
```
Controller throws ApiError
  → Express catches it
    → Global error handler
      → Sends JSON response to client
```

---

## 15. Multi Device Login

### Controlled by environment variable
```
MULTIDEVICE_LOGIN=1 → Multiple devices allowed
MULTIDEVICE_LOGIN=0 → Single device only
```

### Device identification
```
Each device identified by:
  userId + userAgent (browser/device info)

Each session has unique refreshToken:
  → Used to identify and manage individual device sessions
  → Logout only affects current device session
```

### Session per device flow
```
Device 1 (Chrome) → Session 1 { refreshToken: xyz }
Device 2 (Firefox) → Session 2 { refreshToken: abc }

Device 1 logout → deletes Session 1 only
Device 2 still logged in ✅

authMiddleware checks:
  Session.findOne({ userId, refreshToken, isValid: true })
  → Each device checks its own session ✅
```

---

## Quick Reference — Request Examples

### Register
```
POST /api/auth/register
Body: { username, email, password, role }
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, id, email, username }
Cookie set: refreshToken (HttpOnly)
```

### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>
Cookie sent automatically: refreshToken
```

### Refresh Token
```
POST /api/auth/refresh
Cookie sent automatically: refreshToken
Response: { accessToken }
```

### Upload File
```
POST /api/files/upload
Headers: Authorization: Bearer <accessToken>
Body: form-data → key: file, type: File
```

### Get Files
```
GET /api/files?cursor=id&search=photo&type=image&sortBy=createdAt&order=desc
Headers: Authorization: Bearer <accessToken>
```

### Delete File
```
DELETE /api/files/:id
Headers: Authorization: Bearer <accessToken>
```

---

*Documentation created for CloudStorage NodeJS project.*
*Built with Node.js, Express, MongoDB, JWT, Cloudinary.*