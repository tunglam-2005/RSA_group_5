import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DUNG_MA_BIMAT_DE_GIAI_MA_TIN_NHAN } from "../../redux/const/RSAReceiverConst";


const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return "Invalid date";
  }
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};

export default function HomThuReceiver() {
  // Xử lý nhận tin nhắn và mã hóa sau
  const encryptedMessages = useSelector(
    (state) => state.ModalReducer.encryptedMessages
  );
  const dispatch = useDispatch();
  return (
    <>
    {encryptedMessages.map((msg) => (
      <div class="card" key={msg.id}>
        <div class="card-header">Người gửi: {msg.from}  <span style={{borderLeft: "1px solid black", paddingLeft: "10px", marginLeft: "8px"}}>{formatTimestamp(msg.timestamp)}</span> </div>
        <div class="card-body">
          <div className="row">
            <div className="col-7">
              <h4 class="card-title text-center">Tin nhắn mã hóa: </h4>
              <textarea
              className="w-100"
                readOnly
                value={`${msg.message}`}
              ></textarea>
            </div>
            <div className="col-5" style={{position: "relative"}}>
              <button data-bs-dismiss="modal" className="btn btn-primary btnMaHoaSender" onClick={() => {
                dispatch({
                  type: DUNG_MA_BIMAT_DE_GIAI_MA_TIN_NHAN,
                  encryptedMessagesReceiver: msg.message
                })
              }}>Giải mã</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
  );
}
