/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ContactRequest: ResolverTypeWrapper<ContactRequest>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Conversation: ResolverTypeWrapper<Conversation>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  EncryptionKey: ResolverTypeWrapper<EncryptionKey>;
  Group: ResolverTypeWrapper<Group>;
  GroupDetails: ResolverTypeWrapper<GroupDetails>;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserResponse: ResolverTypeWrapper<RegisterUserResponse>;
  SendMessageResponse: ResolverTypeWrapper<SendMessageResponse>;
  User: ResolverTypeWrapper<User>;
  UserWithConversation: ResolverTypeWrapper<UserWithConversation>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  String: Scalars['String']['output'];
  ContactRequest: ContactRequest;
  ID: Scalars['ID']['output'];
  Conversation: Conversation;
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  EncryptionKey: EncryptionKey;
  Group: Group;
  GroupDetails: GroupDetails;
  Message: Message;
  Mutation: {};
  Query: {};
  RegisterUserResponse: RegisterUserResponse;
  SendMessageResponse: SendMessageResponse;
  User: User;
  UserWithConversation: UserWithConversation;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactRequest'] = ResolversParentTypes['ContactRequest']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConversationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Conversation'] = ResolversParentTypes['Conversation']> = {
  groupId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isGroup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  unreadCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EncryptionKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['EncryptionKey'] = ResolversParentTypes['EncryptionKey']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  privateKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  admins?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupDetails'] = ResolversParentTypes['GroupDetails']> = {
  admins?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isGroup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupRecipientId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isGroupMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userRecipientId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUserToGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationAddUserToGroupArgs, 'groupId' | 'userId'>>;
  createGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'memberIds' | 'name'>>;
  deleteMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'forEveryone' | 'messageId'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  markMessagesAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkMessagesAsReadArgs, 'conversationId'>>;
  promoteToAdmin?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationPromoteToAdminArgs, 'groupId' | 'userId'>>;
  refreshToken?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>;
  registerUser?: Resolver<ResolversTypes['RegisterUserResponse'], ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'email' | 'password' | 'phoneNumber' | 'username'>>;
  removeGroupMember?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationRemoveGroupMemberArgs, 'groupId' | 'userId'>>;
  respondContactRequest?: Resolver<ResolversTypes['ContactRequest'], ParentType, ContextType, RequireFields<MutationRespondContactRequestArgs, 'requestId' | 'status'>>;
  sendContactRequest?: Resolver<ResolversTypes['ContactRequest'], ParentType, ContextType, RequireFields<MutationSendContactRequestArgs, 'fromUserId' | 'toUserId'>>;
  sendDirectMessage?: Resolver<ResolversTypes['SendMessageResponse'], ParentType, ContextType, RequireFields<MutationSendDirectMessageArgs, 'content' | 'recipientId'>>;
  sendGroupMessage?: Resolver<ResolversTypes['SendMessageResponse'], ParentType, ContextType, RequireFields<MutationSendGroupMessageArgs, 'content' | 'groupId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getContactRequests?: Resolver<Array<ResolversTypes['ContactRequest']>, ParentType, ContextType, RequireFields<QueryGetContactRequestsArgs, 'userId'>>;
  getContacts?: Resolver<Array<ResolversTypes['UserWithConversation']>, ParentType, ContextType, RequireFields<QueryGetContactsArgs, 'userId'>>;
  getConversation?: Resolver<ResolversTypes['Conversation'], ParentType, ContextType, RequireFields<QueryGetConversationArgs, 'conversationId'>>;
  getConversations?: Resolver<Array<ResolversTypes['Conversation']>, ParentType, ContextType, RequireFields<QueryGetConversationsArgs, 'userId'>>;
  getDirectMessages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryGetDirectMessagesArgs, 'userId'>>;
  getEncryptionKey?: Resolver<ResolversTypes['EncryptionKey'], ParentType, ContextType, RequireFields<QueryGetEncryptionKeyArgs, 'userId'>>;
  getGroupConversations?: Resolver<Array<ResolversTypes['Conversation']>, ParentType, ContextType, RequireFields<QueryGetGroupConversationsArgs, 'userId'>>;
  getGroupDetails?: Resolver<Array<ResolversTypes['GroupDetails']>, ParentType, ContextType, RequireFields<QueryGetGroupDetailsArgs, 'userId'>>;
  getGroupMessages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryGetGroupMessagesArgs, 'groupId'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  getUserGroups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType, RequireFields<QueryGetUserGroupsArgs, 'userId'>>;
  getUsers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
};

export type RegisterUserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterUserResponse'] = ResolversParentTypes['RegisterUserResponse']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendMessageResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendMessageResponse'] = ResolversParentTypes['SendMessageResponse']> = {
  message?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  contacts?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastSeen?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profilePicUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserWithConversationResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserWithConversation'] = ResolversParentTypes['UserWithConversation']> = {
  conversationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  ContactRequest?: ContactRequestResolvers<ContextType>;
  Conversation?: ConversationResolvers<ContextType>;
  EncryptionKey?: EncryptionKeyResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupDetails?: GroupDetailsResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegisterUserResponse?: RegisterUserResponseResolvers<ContextType>;
  SendMessageResponse?: SendMessageResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserWithConversation?: UserWithConversationResolvers<ContextType>;
};

