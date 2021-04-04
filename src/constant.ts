export const Constant = {
  cognitoUserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  cognitoUserPoolWebClientId:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  enableReduxWrapperDebugMode:
    process.env.NEXT_PUBLIC_ENABLE_REDUX_WRAPPER_DEBUG_MODE === '1',
};
