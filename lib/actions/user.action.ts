import apiClientV1 from '../apiClientV1';

export const fetchRegistered = async () => {
  try {
    // Create a user account
    const url = `/admins/account/get-registered-users`;
    const { data } = await apiClientV1.get(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const fetchDeleted = async () => {
  try {
    // Create a user account
    const url = `/admins/account/get-deleted-users`;
    const { data } = await apiClientV1.get(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const searchByUsername = async () => {
  try {
    // Create a user account
    const url = `/admins/account/search-by-username`;
    const { data } = await apiClientV1.post(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const freezeAccount = async () => {
  try {
    // Create a user account
    const url = `/admins/account/freeze-account`;
    const { data } = await apiClientV1.post(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const unfreezeAccount = async () => {
  try {
    // Create a user account
    const url = `/admins/account/unfreeze-account`;
    const { data } = await apiClientV1.post(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const restoreDeleted = async () => {
  try {
    // Create a user account
    const url = `/admins/account/restore-deleted-account`;
    const { data } = await apiClientV1.post(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};
