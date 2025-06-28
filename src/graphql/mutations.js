/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
      id
      title
      date
      endDate
      startTime
      endTime
      location
      aboutEvent
      details
      organizer
      contactDetails
      hostingOrganization
      registrationLink
      registrationType
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
      id
      title
      date
      endDate
      startTime
      endTime
      location
      aboutEvent
      details
      organizer
      contactDetails
      hostingOrganization
      registrationLink
      registrationType
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
      id
      title
      date
      endDate
      startTime
      endTime
      location
      aboutEvent
      details
      organizer
      contactDetails
      hostingOrganization
      registrationLink
      registrationType
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
