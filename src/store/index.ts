import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './auth/slice';
import {globalStoreReducer} from './globalStore/slice';
import {userPhotoReducer} from './user/slice';
import {documentReducer} from './document/slice';
import {contactReducer} from './contacts';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userPhotoReducer,
    document: documentReducer,
    globalStore: globalStoreReducer,
    contacts: contactReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
