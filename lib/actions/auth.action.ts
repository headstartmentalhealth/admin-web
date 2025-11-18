import apiClientV1 from '../apiClientV1';

export const signIn = async ({
  email,
  password,
  environment,
  timezone,
}: signInProps) => {
  try {
    // Create a user account
    // const url = `/users/sign-in?device[type]=web`;
    // const { data } = await apiClientV1.post(url, { email, password }); // ongoing

    return {
      access_token: '',
      refresh_token: '',
      expires_at: '',
      environment,
      timezone,
    };
  } catch (error) {
    console.error('Error', error);
  }
};
