import { createSlice } from '@reduxjs/toolkit';
import { Party } from '../../models/party';

import { PartyRole, PNRole } from '../../models/user';
import { exchangeToken, logout, getOrganizationParty } from './actions';
import { User } from './types';

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: (sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user') || '')
      : {
          email: '',
          name: '',
          uid: '',
          sessionToken: '',
          family_name: '',
          fiscal_number: '',
          organization: {
            id: '',
            roles: [
              {
                role: PNRole.ADMIN,
                partyRole: PartyRole.MANAGER,
              },
            ],
            fiscal_code: '',
          },
          desired_exp: 0
        }) as User,
    organizationParty: {
      id: '',
      name: '',
    } as Party,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getOrganizationParty.fulfilled, (state, action) => {
      state.organizationParty = action.payload;
    });
  },
});

export default userSlice;
