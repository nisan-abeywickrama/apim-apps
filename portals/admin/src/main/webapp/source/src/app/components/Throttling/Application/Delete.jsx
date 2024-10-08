/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import PropTypes from 'prop-types';
import DialogContentText from '@mui/material/DialogContentText';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormDialogBase from 'AppComponents/AdminPages/Addons/FormDialogBase';
import { FormattedMessage, useIntl } from 'react-intl';
import API from 'AppData/api';
import Alert from 'AppComponents/Shared/Alert';

/**
 * Render delete dialog box.
 * @param {JSON} props component props.
 * @returns {JSX} Loading animation.
 */
function Delete(props) {
    const restApi = new API();
    const intl = useIntl();
    const {
        dataRow, updateList,
    } = props;

    const formSaveCallback = () => {
        const policyId = dataRow[4];
        const promiseAPICall = restApi
            .deleteApplicationThrottlingPolicy(policyId)
            .then(() => {
                updateList();
                return (
                    intl.formatMessage({
                        id: 'Throttling.Application.Policy.policy.delete.success',
                        defaultMessage: 'Application Rate Limiting Policy successfully deleted.',
                    })
                );
            })
            .catch(() => {
                Alert.error(
                    intl.formatMessage({
                        id: 'Throttling.Application.Policy.policy.delete.error',
                        defaultMessage: 'Application Rate Limiting Policy could not be deleted.',
                    }),
                );
                return false;
            });

        return (promiseAPICall);
    };

    return (
        <FormDialogBase
            title={intl.formatMessage({
                id: 'Throttling.Application.Policy.policy.dialog.delete.title',
                defaultMessage: 'Delete Application Policy?',
            })}
            saveButtonText={intl.formatMessage({
                id: 'Throttling.Application.Policy.policy.dialog.delete.btn',
                defaultMessage: 'Delete',
            })}
            icon={<DeleteForeverIcon aria-label='delete-application-policies' />}
            formSaveCallback={formSaveCallback}
        >
            <DialogContentText>
                <FormattedMessage
                    id='Throttling.Application.Policy.policy.dialog.delete.error'
                    defaultMessage='Application Rate Limiting Policy will be deleted.'
                />
            </DialogContentText>
        </FormDialogBase>
    );
}
Delete.propTypes = {
    updateList: PropTypes.number.isRequired,
    selectedPolicyName: PropTypes.shape({
        name: PropTypes.number.isRequired,
    }).isRequired,
    dataRow: PropTypes.shape({
        policyId: PropTypes.number.isRequired,
    }).isRequired,
};
export default Delete;
