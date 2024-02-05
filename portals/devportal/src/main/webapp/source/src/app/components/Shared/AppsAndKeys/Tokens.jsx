/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/lab/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TextField from '@mui/material/TextField';

// Styles for Grid and Paper elements
const styles = theme => ({
    FormControl: {
        padding: theme.spacing(2),
        width: '100%',
    },
    FormControlOdd: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
    quotaHelp: {
        position: 'relative',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(0.25),
    },
});

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 224,
            width: 250,
        },
    },
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "left"
    },
    getContentAnchorEl: null,
};

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

/**
 * Used to display generate access token UI
 */
const tokens = (props) => {
    /**
    * This method is used to handle the updating of create application
    * request object.
    * @param {*} field field that should be updated in appliction request
    * @param {*} event event fired
    */
    const handleChange = (field, event) => {
        const { accessTokenRequest, updateAccessTokenRequest } = props;
        const newRequest = { ...accessTokenRequest };

        const { target: currentTarget } = event;

        switch (field) {
            case 'scopesSelected':
                newRequest.scopesSelected = currentTarget.value;
                break;
            case 'keyType':
                newRequest.keyType = currentTarget.value;
                break;
            default:
                break;
        }
        updateAccessTokenRequest(newRequest);
    };
    const {
        classes, accessTokenRequest, subscriptionScopes,
    } = props;

    return (
        <>
            <FormControl
                variant="standard"
                margin='normal'
                className={classes.FormControlOdd}
                disabled={subscriptionScopes.length === 0}
            >
                <Autocomplete
                    multiple
                    limitTags={5}
                    id='scopesSelected'
                    name='scopesSelected'
                    options={subscriptionScopes}
                    noOptionsText='No scopes available'
                    disableCloseOnSelect
                    value={accessTokenRequest.scopesSelected}
                    onChange={(e, newValue) => handleChange('scopesSelected', { target: { value: newValue } })}
                    renderOption={(option, { selected }) => (
                        <>
                            <Checkbox
                                id={'access-token-scope-' + option}
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </>
                    )}
                    renderInput={(params) => (
                        <TextField {...params}
                            margin='dense'
                            variant='outlined'
                            label={<FormattedMessage
                                htmlFor='quota-helper'
                                className={classes.quotaHelp}
                                id='Shared.AppsAndKeys.Tokens.when.you.generate.scopes'
                                defaultMessage='Scopes'
                            />}
                        />
                    )}
                />
                <Typography variant='caption'>
                    <FormattedMessage
                        id='Shared.AppsAndKeys.Tokens.when.you.generate'
                        defaultMessage={'When you generate access tokens to APIs protected by scope/s,'
                            + ' you can select the scope/s and then generate the token for it. Scopes enable '
                            + 'fine-grained access control to API resources based on user roles. You define scopes to '
                            + 'an API resource. When a user invokes the API, his/her OAuth 2 bearer token cannot grant '
                            + 'access to any API resource beyond its associated scopes.'}
                    />
                </Typography>
            </FormControl>
        </>
    );
};
tokens.contextTypes = {
    intl: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(tokens);
