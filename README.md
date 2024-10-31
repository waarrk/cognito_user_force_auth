# Cognito Force Authentication Script

This Node.js program authenticates a user in AWS Cognito using the `ADMIN_USER_PASSWORD_AUTH` flow. It forces a password change if required, helping administrators manage and test Cognito user accounts.

## Features

- **Admin Authentication**: Authenticates a user using Cognito's `ADMIN_USER_PASSWORD_AUTH` flow.
- **Password Reset**: Handles forced password change and sets a new password if required.
- **Environment-based Configuration**: Uses a `.env` file to securely manage credentials and settings.

## Prerequisites

1. **Node.js**: Ensure Node.js is installed.
2. **AWS SDK for JavaScript v3**: Uses `@aws-sdk/client-cognito-identity-provider` for Cognito operations.
3. **dotenv**: Manages environment variables using a `.env` file.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repo/cognito-auth-script.git
   cd cognito-auth-script

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables by creating a .env file in the project root. See Configuration for details.

## Configuration

Create a .env file with the following parameters:

```plaintext
### AWS settings

AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token

# Cognito User Pool and Client settings

USER_POOL_ID=ap-northeast-1_example
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# User credentials

USERNAME=cognito_user_username
INITIAL_PASSWORD=user_initial_password
NEW_PASSWORD=user_new_password
```

Note: Replace your_access_key, your_secret_key, your_session_token, etc., with the actual values. These values are used for AWS IAM credentials, Cognito User Pool settings, and user credentials in AWS Cognito.

## Usage
To run the authentication script, use the following command:

```bash
node cognito-auth.js
```
