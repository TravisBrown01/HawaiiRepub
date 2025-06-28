/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onCreateEvent(filter: $filter, owner: $owner) {
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
      photoUrls
      attachmentUrls
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onUpdateEvent(filter: $filter, owner: $owner) {
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
      photoUrls
      attachmentUrls
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onDeleteEvent(filter: $filter, owner: $owner) {
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
      photoUrls
      attachmentUrls
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
