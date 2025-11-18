import apiClientV1 from '../apiClientV1';

export const fetchRatings = async () => {
  try {
    // Get ratings
    const url = `/admins/general/get-ratings`;
    const { data } = await apiClientV1.get(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const fetchSuggestions = async () => {
  try {
    // Get ratings
    const url = `/admins/general/get-suggestions`;
    const { data } = await apiClientV1.get(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const fetchFeedbacks = async () => {
  try {
    // Get ratings
    const url = `/admins/general/get-feedbacks`;
    const { data } = await apiClientV1.get(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const deleteRating = async () => {
  try {
    // Get ratings
    const url = `/admins/general/delete-rating`;
    const { data } = await apiClientV1.delete(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const deleteSuggestion = async () => {
  try {
    // Get ratings
    const url = `/admins/general/delete-suggestion`;
    const { data } = await apiClientV1.delete(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};

export const deleteFeedback = async () => {
  try {
    // Get ratings
    const url = `/admins/general/delete-feedback`;
    const { data } = await apiClientV1.delete(url); // ongoing
  } catch (error) {
    console.error('Error', error);
  }
};
