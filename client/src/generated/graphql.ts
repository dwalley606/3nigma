/* eslint-disable */
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type ContactRequest = {
  __typename?: 'ContactRequest';
  createdAt: Scalars['String']['output'];
  from: User;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  to: User;
};

export type Conversation = {
  __typename?: 'Conversation';
  groupId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isGroup: Scalars['Boolean']['output'];
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  name?: Maybe<Scalars['String']['output']>;
  participants: Array<User>;
  unreadCount?: Maybe<Scalars['Int']['output']>;
};

export type EncryptionKey = {
  __typename?: 'EncryptionKey';
  id: Scalars['ID']['output'];
  privateKey: Scalars['String']['output'];
  publicKey: Scalars['String']['output'];
  user: User;
};

export type Group = {
  __typename?: 'Group';
  admins: Array<User>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  members: Array<User>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type GroupDetails = {
  __typename?: 'GroupDetails';
  admins: Array<User>;
  id: Scalars['ID']['output'];
  isGroup: Scalars['Boolean']['output'];
  lastMessage?: Maybe<Message>;
  members: Array<User>;
  name: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  groupRecipientId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isGroupMessage: Scalars['Boolean']['output'];
  sender: User;
  timestamp: Scalars['String']['output'];
  userRecipientId?: Maybe<Scalars['ID']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToGroup: Group;
  createGroup: Group;
  deleteMessage: Scalars['Boolean']['output'];
  login: AuthPayload;
  markMessagesAsRead: Scalars['Boolean']['output'];
  promoteToAdmin: Group;
  refreshToken?: Maybe<AuthPayload>;
  registerUser: RegisterUserResponse;
  removeGroupMember: Group;
  respondContactRequest: ContactRequest;
  sendContactRequest: ContactRequest;
  sendDirectMessage: SendMessageResponse;
  sendGroupMessage: SendMessageResponse;
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateGroupArgs = {
  memberIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  forEveryone: Scalars['Boolean']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkMessagesAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationPromoteToAdminArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRespondContactRequestArgs = {
  requestId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationSendContactRequestArgs = {
  fromUserId: Scalars['ID']['input'];
  toUserId: Scalars['ID']['input'];
};


export type MutationSendDirectMessageArgs = {
  content: Scalars['String']['input'];
  recipientId: Scalars['ID']['input'];
};


export type MutationSendGroupMessageArgs = {
  content: Scalars['String']['input'];
  groupId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  getContactRequests: Array<ContactRequest>;
  getContacts: Array<UserWithConversation>;
  getConversation: Conversation;
  getConversations: Array<Conversation>;
  getDirectMessages: Array<Message>;
  getEncryptionKey: EncryptionKey;
  getGroupConversations: Array<Conversation>;
  getGroupDetails: Array<GroupDetails>;
  getGroupMessages: Array<Message>;
  getUserById?: Maybe<User>;
  getUserGroups?: Maybe<Array<Maybe<Group>>>;
  getUsers?: Maybe<Array<User>>;
};


export type QueryGetContactRequestsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetContactsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetConversationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetDirectMessagesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetEncryptionKeyArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupConversationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupDetailsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupMessagesArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserGroupsArgs = {
  userId: Scalars['ID']['input'];
};

export type RegisterUserResponse = {
  __typename?: 'RegisterUserResponse';
  user: User;
};

export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  message: Message;
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  contacts: Array<User>;
  email: Scalars['String']['output'];
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  lastSeen: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  publicKey: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserWithConversation = {
  __typename?: 'UserWithConversation';
  conversationId?: Maybe<Scalars['ID']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type ContactRequest = {
  __typename?: 'ContactRequest';
  createdAt: Scalars['String']['output'];
  from: User;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  to: User;
};

export type Conversation = {
  __typename?: 'Conversation';
  groupId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isGroup: Scalars['Boolean']['output'];
  lastMessage?: Maybe<Message>;
  messages: Array<Message>;
  name?: Maybe<Scalars['String']['output']>;
  participants: Array<User>;
  unreadCount?: Maybe<Scalars['Int']['output']>;
};

export type EncryptionKey = {
  __typename?: 'EncryptionKey';
  id: Scalars['ID']['output'];
  privateKey: Scalars['String']['output'];
  publicKey: Scalars['String']['output'];
  user: User;
};

export type Group = {
  __typename?: 'Group';
  admins: Array<User>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  members: Array<User>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type GroupDetails = {
  __typename?: 'GroupDetails';
  admins: Array<User>;
  id: Scalars['ID']['output'];
  isGroup: Scalars['Boolean']['output'];
  lastMessage?: Maybe<Message>;
  members: Array<User>;
  name: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  groupRecipientId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isGroupMessage: Scalars['Boolean']['output'];
  sender: User;
  timestamp: Scalars['String']['output'];
  userRecipientId?: Maybe<Scalars['ID']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToGroup: Group;
  createGroup: Group;
  deleteMessage: Scalars['Boolean']['output'];
  login: AuthPayload;
  markMessagesAsRead: Scalars['Boolean']['output'];
  promoteToAdmin: Group;
  refreshToken?: Maybe<AuthPayload>;
  registerUser: RegisterUserResponse;
  removeGroupMember: Group;
  respondContactRequest: ContactRequest;
  sendContactRequest: ContactRequest;
  sendDirectMessage: SendMessageResponse;
  sendGroupMessage: SendMessageResponse;
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateGroupArgs = {
  memberIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  forEveryone: Scalars['Boolean']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkMessagesAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationPromoteToAdminArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRespondContactRequestArgs = {
  requestId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationSendContactRequestArgs = {
  fromUserId: Scalars['ID']['input'];
  toUserId: Scalars['ID']['input'];
};


export type MutationSendDirectMessageArgs = {
  content: Scalars['String']['input'];
  recipientId: Scalars['ID']['input'];
};


export type MutationSendGroupMessageArgs = {
  content: Scalars['String']['input'];
  groupId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  getContactRequests: Array<ContactRequest>;
  getContacts: Array<UserWithConversation>;
  getConversation: Conversation;
  getConversations: Array<Conversation>;
  getDirectMessages: Array<Message>;
  getEncryptionKey: EncryptionKey;
  getGroupConversations: Array<Conversation>;
  getGroupDetails: Array<GroupDetails>;
  getGroupMessages: Array<Message>;
  getUserById?: Maybe<User>;
  getUserGroups?: Maybe<Array<Maybe<Group>>>;
  getUsers?: Maybe<Array<User>>;
};


export type QueryGetContactRequestsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetContactsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetConversationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetDirectMessagesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetEncryptionKeyArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupConversationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupDetailsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetGroupMessagesArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserGroupsArgs = {
  userId: Scalars['ID']['input'];
};

export type RegisterUserResponse = {
  __typename?: 'RegisterUserResponse';
  user: User;
};

export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  message: Message;
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  contacts: Array<User>;
  email: Scalars['String']['output'];
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  lastSeen: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  publicKey: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserWithConversation = {
  __typename?: 'UserWithConversation';
  conversationId?: Maybe<Scalars['ID']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};
