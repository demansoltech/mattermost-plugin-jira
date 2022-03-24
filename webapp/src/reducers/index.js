// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import ActionTypes from 'action_types';

function installedInstances(state = [], action) {
    // We're notified of the instance status at startup (through getConnected)
    // and when we get a websocket instance_status event
    switch (action.type) {
    case ActionTypes.RECEIVED_INSTANCE_STATUS:
        return action.data.instances ? action.data.instances : [];
    default:
        return state;
    }
}

function userConnected(state = false, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_CONNECTED:
        return action.data.is_connected;
    default:
        return state;
    }
}

function userCanConnect(state = false, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_CONNECTED:
        return action.data.can_connect;
    default:
        return state;
    }
}

function defaultUserInstanceID(state = '', action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_CONNECTED:
        if (action.data.user_info && action.data.user_info.default_instance_id) {
            return action.data.user_info.default_instance_id;
        }
        return state;
    default:
        return state;
    }
}

function userConnectedInstances(state = [], action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_CONNECTED:
        if (action.data.user_info) {
            return action.data.user_info.connected_instances ? action.data.user_info.connected_instances : [];
        }
        return state;
    default:
        return state;
    }
}

function pluginSettings(state = null, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_PLUGIN_SETTINGS:
        return action.data;
    default:
        return state;
    }
}

const connectModalVisible = (state = false, action) => {
    switch (action.type) {
    case ActionTypes.OPEN_CONNECT_MODAL:
        return true;
    case ActionTypes.CLOSE_CONNECT_MODAL:
        return false;
    default:
        return state;
    }
};

const disconnectModalVisible = (state = false, action) => {
    switch (action.type) {
    case ActionTypes.OPEN_DISCONNECT_MODAL:
        return true;
    case ActionTypes.CLOSE_DISCONNECT_MODAL:
        return false;
    default:
        return state;
    }
};

const createModalVisible = (state = false, action) => {
    switch (action.type) {
    case ActionTypes.OPEN_CREATE_ISSUE_MODAL:
    case ActionTypes.OPEN_CREATE_ISSUE_MODAL_WITHOUT_POST:
        return true;
    case ActionTypes.CLOSE_CREATE_ISSUE_MODAL:
        return false;
    default:
        return state;
    }
};

const createModal = (state = '', action) => {
    switch (action.type) {
    case ActionTypes.OPEN_CREATE_ISSUE_MODAL:
    case ActionTypes.OPEN_CREATE_ISSUE_MODAL_WITHOUT_POST:
        return {
            ...state,
            postId: action.data.postId,
            description: action.data.description,
            channelId: action.data.channelId,
        };
    case ActionTypes.CLOSE_CREATE_ISSUE_MODAL:
        return {};
    default:
        return state;
    }
};

const attachCommentToIssueModalVisible = (state = false, action) => {
    switch (action.type) {
    case ActionTypes.OPEN_ATTACH_COMMENT_TO_ISSUE_MODAL:
        return true;
    case ActionTypes.CLOSE_ATTACH_COMMENT_TO_ISSUE_MODAL:
        return false;
    default:
        return state;
    }
};

const attachCommentToIssueModalForPostId = (state = '', action) => {
    switch (action.type) {
    case ActionTypes.OPEN_ATTACH_COMMENT_TO_ISSUE_MODAL:
        return action.data.postId;
    case ActionTypes.CLOSE_ATTACH_COMMENT_TO_ISSUE_MODAL:
        return '';
    default:
        return state;
    }
};

const channelIdWithSettingsOpen = (state = '', action) => {
    switch (action.type) {
    case ActionTypes.OPEN_CHANNEL_SETTINGS:
        return action.data.channelId;
    case ActionTypes.CLOSE_CHANNEL_SETTINGS:
        return '';
    default:
        return state;
    }
};

const channelSubscriptions = (state = {}, action) => {
    switch (action.type) {
    case ActionTypes.RECEIVED_CHANNEL_SUBSCRIPTIONS: {
        const nextState = {...state};
        nextState[action.channelId] = action.data;
        return nextState;
    }
    case ActionTypes.DELETED_CHANNEL_SUBSCRIPTION: {
        const sub = action.data;
        const newSubs = state[sub.channel_id].concat([]);
        newSubs.splice(newSubs.findIndex((s) => s.id === sub.id), 1);

        return {
            ...state,
            [sub.channel_id]: newSubs,
        };
    }
    case ActionTypes.CREATED_CHANNEL_SUBSCRIPTION: {
        const sub = action.data;
        const newSubs = state[sub.channel_id].concat([]);
        newSubs.push(sub);

        return {
            ...state,
            [sub.channel_id]: newSubs,
        };
    }
    case ActionTypes.EDITED_CHANNEL_SUBSCRIPTION: {
        const sub = action.data;
        const newSubs = state[sub.channel_id].concat([]);
        newSubs.splice(newSubs.findIndex((s) => s.id === sub.id), 1, sub);

        return {
            ...state,
            [sub.channel_id]: newSubs,
        };
    }
    default:
        return state;
    }
};

const getIssueByKey = (state = {}, action) => {
    const assignee = action.data.fields.assignee;
    const ticketData = action.data;
    switch (action.type) {
    case ActionTypes.RECEIVED_JIRA_TICKETS :
        return {
            ...state,
            isloaded: true,
            assigneeName: assignee && assignee.displayName ? assignee.displayName : '',
            assigneeAvatar: assignee && assignee.avatarUrls && assignee.avatarUrls['48x48'] ? assignee.avatarUrls['48x48'] : '',
            labels: ticketData.fields.labels,
            description: ticketData.fields.description,
            summary: ticketData.fields.summary,
            ticketId: ticketData.key,
            jiraIcon: ticketData.fields.project.avatarUrls['48x48'],
            versions: ticketData.fields.versions.lenght > 0 ? ticketData.fields.versions.versions[0] : '',
            statusKey: ticketData.fields.status.name,
            issueIcon: ticketData.fields.issuetype.iconUrl,
        };
    case ActionTypes.RECEIVED_JIRA_TICKETS_ERROR :
        return {
            ...state,
            error: action.error,
        };
    default:
        return state;
    }
};

export default combineReducers({
    userConnected,
    userCanConnect,
    userConnectedInstances,
    installedInstances,
    defaultUserInstanceID,
    pluginSettings,
    connectModalVisible,
    disconnectModalVisible,
    createModalVisible,
    createModal,
    attachCommentToIssueModalVisible,
    attachCommentToIssueModalForPostId,
    channelIdWithSettingsOpen,
    channelSubscriptions,
    getIssueByKey,
});
