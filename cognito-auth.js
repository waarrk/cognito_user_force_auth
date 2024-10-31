require('dotenv').config();
const { CognitoIdentityProviderClient, AdminInitiateAuthCommand, AdminRespondToAuthChallengeCommand } = require('@aws-sdk/client-cognito-identity-provider');
const crypto = require('crypto');

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const username = process.env.USERNAME;
const initialPassword = process.env.INITIAL_PASSWORD;
const newPassword = process.env.NEW_PASSWORD;
const secretHash = generateSecretHash(username, clientId, clientSecret);

console.log("Debug Info:");
console.log("UserPoolId:", userPoolId);
console.log("ClientId:", clientId);
console.log("ClientSecret:", clientSecret);
console.log("Username:", username);
console.log("InitialPassword:", initialPassword);
console.log("NewPassword:", newPassword);
console.log("SecretHash:", secretHash);

function generateSecretHash(username, clientId, clientSecret) {
    return crypto
        .createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64');
}

async function authenticateUser() {
    try {
        const initiateAuthParams = {
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            ClientId: clientId,
            UserPoolId: userPoolId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: initialPassword,
                SECRET_HASH: secretHash
            }
        };

        console.log("InitiateAuthParams:", JSON.stringify(initiateAuthParams, null, 2));

        const authCommand = new AdminInitiateAuthCommand(initiateAuthParams);
        const authResult = await client.send(authCommand);
        console.log("Initiate Auth Response:", JSON.stringify(authResult, null, 2));

        if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            const respondChallengeParams = {
                UserPoolId: userPoolId,
                ClientId: clientId,
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ChallengeResponses: {
                    USERNAME: username,
                    NEW_PASSWORD: newPassword,
                    SECRET_HASH: secretHash
                },
                Session: authResult.Session
            };

            console.log("RespondChallengeParams:", JSON.stringify(respondChallengeParams, null, 2));

            const challengeCommand = new AdminRespondToAuthChallengeCommand(respondChallengeParams);
            const challengeResult = await client.send(challengeCommand);
            console.log("Challenge Response:", JSON.stringify(challengeResult, null, 2));

            if (challengeResult.AuthenticationResult) {
                console.log("User authenticated successfully!");
            }
        } else {
            console.log("Authentication completed without NEW_PASSWORD_REQUIRED challenge.");
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);

        if (error.name === 'ResourceNotFoundException') {
            console.log("ResourceNotFoundException: User Pool ID or Client ID may be incorrect.");
        } else {
            console.log("An unexpected error occurred:", error);
        }
    }
}

authenticateUser();
