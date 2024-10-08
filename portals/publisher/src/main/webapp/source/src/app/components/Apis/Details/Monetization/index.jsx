import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Progress } from 'AppComponents/Shared';
import Alert from 'AppComponents/Shared/Alert';
import API from 'AppData/api';
import APIProduct from 'AppData/APIProduct';
import { isRestricted } from 'AppData/AuthManager';

import BusinessPlans from './BusinessPlans';

const PREFIX = 'index';

const classes = {
    root: `${PREFIX}-root`,
    container: `${PREFIX}-container`,
    margin: `${PREFIX}-margin`,
    paper: `${PREFIX}-paper`,
    grid: `${PREFIX}-grid`,
    button: `${PREFIX}-button`
};

const Root = styled('form')(({ theme }) => ({
    [`& .${classes.root}`]: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },

    [`& .${classes.container}`]: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    [`& .${classes.margin}`]: {
        margin: theme.spacing(),
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary,
        paddingBottom: '10px',
    },

    [`& .${classes.grid}`]: {
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        minWidth: '50%',
    },

    [`& .${classes.button}`]: {
        margin: theme.spacing(),
    }
}));

/**
 *
 *
 * @class Monetization
 * @extends {Component}
 */
class Monetization extends Component {
    constructor(props) {
        super(props);
        this.businessPlans = React.createRef()
        this.state = {
            monetizationAttributes: [],
            monStatus: null,
            enableReadOnly: false,
            property: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getMonetizationData();
    }

    getMonetizationData() {
        const { api } = this.props;
        api.getSettings().then((settings) => {
            this.setState({ enableReadOnly: settings.portalConfigurationOnlyModeEnabled });
        });
        if (api.apiType === API.CONSTS.APIProduct) {
            const apiProduct = new APIProduct(api.name, api.context, api.policies);
            apiProduct.getSettings().then((settings) => {
                if (settings.monetizationAttributes != null) {
                    this.setState({ monetizationAttributes: settings.monetizationAttributes });
                }
            });
            apiProduct.getMonetization(this.props.api.id).then((status) => {
                this.setState({ monStatus: status.enabled });
            });
        } else {
            api.getSettings().then((settings) => {
                if (settings.monetizationAttributes != null) {
                    this.setState({ monetizationAttributes: settings.monetizationAttributes });
                }
            });
            api.getMonetization(this.props.api.id).then((status) => {
                this.setState({ monStatus: status.enabled });
            });
        }
    }

    handleChange = (event) => {
        this.setState({ monStatus: event.target.checked });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((oldState) => {
            const { property } = oldState;
            property[name] = value;
            return { property };
        });
    };

    /**
     * Handles the submit action for configuring monetization
     */
    handleSubmit() {
        const { api, intl } = this.props;
        if (api.apiType === API.CONSTS.APIProduct) {
            const properties = this.state.property;
            const enabled = this.state.monStatus;
            const body = {
                enabled,
                properties,
            };
            const apiProduct = new APIProduct(api.name, api.context, api.policies);
            const promisedMonetization = apiProduct.configureMonetizationToApiProduct(api.id, body);
            promisedMonetization.then((response) => {
                const status = JSON.parse(response.data);
                if (status.enabled) {
                    Alert.info(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.monetization.configured.successfully',
                        defaultMessage: 'Monetization Enabled Successfully',
                    }));
                } else {
                    Alert.info(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.monetization.disabled.successfully',
                        defaultMessage: 'Monetization Disabled Successfully',
                    }));
                }
                this.businessPlans.current.getPoliciesAndMonetization();
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    Alert.error(error.response.body.description);
                } else {
                    Alert.error(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.something.went.wrong.while.configuring.monetization',
                        defaultMessage: 'Something went wrong while configuring monetization',
                    }));
                }
            });
        } else {
            const properties = this.state.property;
            const enabled = this.state.monStatus;
            const body = {
                enabled,
                properties,
            };
            const promisedMonetizationConf = api.configureMonetizationToApi(this.props.api.id, body);
            promisedMonetizationConf.then((response) => {
                const status = JSON.parse(response.data);
                if (status.enabled) {
                    Alert.info(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.monetization.configured.successfully',
                        defaultMessage: 'Monetization Enabled Successfully',
                    }));
                } else {
                    Alert.info(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.monetization.disabled.successfully',
                        defaultMessage: 'Monetization Disabled Successfully',
                    }));
                }
                this.businessPlans.current.getPoliciesAndMonetization();
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    Alert.error(error.response.body.description);
                } else {
                    Alert.error(intl.formatMessage({
                        id: 'Apis.Details.Monetization.Index.something.went.wrong.while.configuring.monetization',
                        defaultMessage: 'Something went wrong while configuring monetization',
                    }));
                }
            });
        }
    }

    render() {
        const { api, } = this.props;
        const { monetizationAttributes, monStatus, enableReadOnly } = this.state;
        if (api && isRestricted(['apim:api_publish'], api)) {
            return (
                <Grid
                    container
                    direction='row'
                    alignItems='center'
                    spacing={4}
                    style={{ marginTop: 20 }}
                >
                    <Grid item>
                        <Typography variant='body2' color='primary'>
                            <FormattedMessage
                                id='Apis.Details.Monetization.Index.update.not.allowed'
                                defaultMessage={'* You are not authorized to update API monetization'
                                    + ' due to insufficient permissions'}
                            />
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
        if (!monetizationAttributes || monStatus === null) {
            return <Progress />;
        }
        return (
            <Root method='post' onSubmit={this.handleSubmit}>
                <Grid container xs={6} spacing={2}>
                    <Grid item xs={12}>
                        <Typography id='itest-api-details-api-monetization-head' variant='h4' component='h2'>
                            <FormattedMessage
                                id='Apis.Details.Monetization.Index.monetization'
                                defaultMessage='Monetization'
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    disabled={isRestricted(['apim:api_publish'], api)}
                                    id='monStatus'
                                    name='monStatus'
                                    checked={monStatus}
                                    onChange={this.handleChange}
                                    value={monStatus}
                                    color='primary'
                                />
                            )}
                            label={(
                                <FormattedMessage
                                    id='Apis.Details.Monetization.Index.monetization.enable.label'
                                    defaultMessage='Enable Monetization'
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.root} sx={{ }}>
                            <Grid item xs={12} className={classes.grid}>
                                <Typography className={classes.heading} variant='h6' component='h3'>
                                    <FormattedMessage
                                        id='Apis.Details.Monetization.Index.monetization.properties'
                                        defaultMessage='Monetization Properties'
                                    />
                                </Typography>
                                {
                                    (monetizationAttributes.length > 0) ? (
                                        (monetizationAttributes.map((monetizationAttribute, i) => (
                                            <TextField
                                                disabled={!monStatus || isRestricted(['apim:api_publish'], api)}
                                                fullWidth
                                                id={'attribute' + i}
                                                label={monetizationAttribute.displayName}
                                                placeholder={monetizationAttribute.displayName}
                                                name={monetizationAttribute.name}
                                                type='text'
                                                margin='normal'
                                                variant='outlined'
                                                required={monetizationAttribute.required}
                                                onChange={this.handleInputChange}
                                                autoFocus
                                            />
                                        )))
                                    ) : (
                                        <Typography>
                                            <FormattedMessage
                                                id={'Apis.Details.Monetization.Index.there.are.no'
                                                   + ' .monetization.properties.configured'}
                                                defaultMessage='There are no monetization properties configured'
                                            />
                                        </Typography>
                                    )
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.root}>
                            <Grid item xs={12} className={classes.grid}>
                                <BusinessPlans api={api} monStatus={monStatus} ref={this.businessPlans} />
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={this.handleSubmit}
                            color='primary'
                            variant='contained'
                            className={classes.button}
                            disabled={api.isRevision || enableReadOnly}
                        >
                            <FormattedMessage
                                id='Apis.Details.Monetization.Index.save'
                                defaultMessage='Save'
                            />
                        </Button>
                        <Button
                            component={Link}
                            to={'/apis/' + api.id + '/overview'}
                        >
                            <FormattedMessage
                                id='Apis.Details.Monetization.Index.cancel'
                                defaultMessage='Cancel'
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Root>
        );
    }
}

Monetization.propTypes = {
    api: PropTypes.instanceOf(API).isRequired,
    classes: PropTypes.shape({}).isRequired,
    intl: PropTypes.shape({
        formatMessage: PropTypes.func,
    }).isRequired,
};

export default injectIntl(withRouter((Monetization)));
