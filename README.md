# Collaborative Document Editor

A real-time collaborative document editor built with the MERN stack, featuring Google Docs-like functionality with real-time editing, user presence, and document sharing.

## Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously with live updates
- **User Authentication**: Secure JWT-based authentication system
- **Document Management**: Create, edit, and organize documents
- **User Presence**: See who's currently viewing and editing documents
- **Auto-save**: Documents are automatically saved as you type
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Avatars**: Color-coded user indicators for easy identification

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd collaborative-document-editor
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/collaborative-docs
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_SECRET=your-nextauth-secret
   \`\`\`

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   \`\`\`bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas cloud database
   \`\`\`

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   \`\`\`bash
   npm run dev:full
   \`\`\`
   
   **Option 2: Run separately**
   \`\`\`bash
   # Terminal 1 - Frontend (Next.js)
   npm run dev
   
   # Terminal 2 - Backend (Socket.IO server)
   npm run server
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:3000
   - Socket.IO Server: http://localhost:3001

## Project Structure

\`\`\`
collaborative-document-editor/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── documents/            # Document CRUD operations
│   ├── editor/[id]/              # Document editor page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # Database connection
│   └── socket.ts                 # Socket.IO configuration
├── models/                       # MongoDB schemas
│   ├── User.ts                   # User model
│   └── Document.ts               # Document model
├── server.js                     # Socket.IO server
└── package.json                  # Dependencies and scripts
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user

### Documents
- \`GET /api/documents\` - Get user's documents
- \`POST /api/documents\` - Create new document
- \`GET /api/documents/[id]\` - Get specific document
- \`PUT /api/documents/[id]\` - Update document

## Socket.IO Events

### Client to Server
- \`join-document\` - Join a document room
- \`document-change\` - Send document changes
- \`cursor-position\` - Send cursor position

### Server to Client
- \`document-updated\` - Receive document updates
- \`user-joined\` - User joined document
- \`user-left\` - User left document
- \`cursor-position\` - Receive cursor positions

## Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  color: String (for user identification),
  timestamps: true
}
\`\`\`

### Document Model
\`\`\`javascript
{
  title: String,
  content: String,
  owner: ObjectId (ref: User),
  collaborators: [ObjectId] (ref: User),
  permissions: Map,
  version: Number,
  history: [Object],
  timestamps: true
}
\`\`\`

## Features in Detail

### Real-time Collaboration
- Uses Socket.IO for bidirectional communication
- Operational Transformation for conflict resolution
- Live cursor tracking and user presence
- Automatic conflict resolution for simultaneous edits

### Authentication & Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Secure Socket.IO connections

### Document Management
- CRUD operations for documents
- Auto-save functionality with debouncing
- Version history tracking
- Document sharing and permissions

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Create new app on Railway or Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Update MONGODB_URI in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue on GitHub.
