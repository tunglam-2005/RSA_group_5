import React from "react";
import { DUNG_MA_CONGKHAI_DE_MA_HOA_TIN_NHAN, XEM_THU_GUI_DEN } from "./const/RSASenderConst";
import { DUNG_MA_BIMAT_DE_GIAI_MA_TIN_NHAN, XEM_THU_GUI_DEN_RECEIVER } from "./const/RSAReceiverConst";
const initialState = {
  Component: <p>Kien Pro</p>,
  title: "",
  encryptedMessages: [],
  encryptedMessageReceiver: "",
  publicKeys: [],
  publicKeySender: {},
  choosePublicKey: false,
  chooseEncryptedMessage: false,
};

export const ModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case XEM_THU_GUI_DEN: {
        return {...state, Component: action.Component, title: "Khóa công khai gửi đến", publicKeys: action.publicKeys}
    }
    case XEM_THU_GUI_DEN_RECEIVER: {
      return {...state, Component: action.Component, title: "Tin nhắn mã hóa gửi đến", encryptedMessages: action.encryptedMessages}
    }
    case DUNG_MA_CONGKHAI_DE_MA_HOA_TIN_NHAN: {
      return {...state, publicKeySender: action.publicKey, choosePublicKey: true};
    }

    case DUNG_MA_BIMAT_DE_GIAI_MA_TIN_NHAN: {
      return {...state, encryptedMessageReceiver: action.encryptedMessagesReceiver, chooseEncryptedMessage: true}
    }
    default:
      return { ...state };
  }
};
