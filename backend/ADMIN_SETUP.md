# Admin Access Configuration

## Environment Setup

To configure admin access for the contact message management system, add the following environment variable to your `.env` file:

```env
# Admin emails (comma-separated list)
ADMIN_EMAILS=admin@example.com,owner@company.com,manager@business.org
```

## How It Works

1. **Authentication Required**: Users must be logged in with a valid JWT token
2. **Admin Check**: The system checks if the authenticated user's email is in the `ADMIN_EMAILS` list
3. **Case Insensitive**: Email comparison is done in lowercase for flexibility

## Protected Endpoints

Only users with admin emails can access:

- `GET /api/contact/messages` - View all contact messages
- `PATCH /api/contact/messages/:id/accept` - Update message status

## Setup Instructions

1. Add your admin email addresses to the `.env` file:

   ```env
   ADMIN_EMAILS=your-admin-email@domain.com,another-admin@domain.com
   ```

2. Register/login with an account using one of the admin emails

3. Use the JWT token to access admin endpoints

## Example Usage

1. **Login with admin email:**

   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"yourpassword"}'
   ```

2. **Get contact messages (admin only):**

   ```bash
   curl -X GET http://localhost:3001/api/contact/messages \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Accept a message (admin only):**
   ```bash
   curl -X PATCH http://localhost:3001/api/contact/messages/MESSAGE_ID/accept \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"isAccepted": true}'
   ```

## Security Notes

- Keep admin emails in environment variables, never hardcode them
- Use strong passwords for admin accounts
- Regularly rotate JWT secrets
- Monitor admin access logs
