import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./HomThuSender.css";
import { DUNG_MA_CONGKHAI_DE_MA_HOA_TIN_NHAN } from "../../redux/const/RSASenderConst";


const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return "Invalid date";
  }
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};


export default function HomThuSender() {
  const { publicKeys } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();
  return (
    <>
      {publicKeys.map((key) => (
        <div class="card" key={key.id}>
          <div class="card-header">Người gửi: {key.from}   <span style={{borderLeft: "1px solid black", paddingLeft: "10px", marginLeft: "8px"}}>{formatTimestamp(key.timestamp)}</span> </div>
          <div class="card-body">
            <div className="row">
              <div className="col-7">
                <h4 class="card-title text-center">Khóa công khai</h4>
                <textarea
                className="w-100"
                  readOnly
                  value={`e: ${key.publicKey.e}\nn:${key.publicKey.n}`}
                ></textarea>
              </div>
              <div className="col-5" style={{position: "relative"}}>
                <button data-bs-dismiss="modal" className="btn btn-primary btnMaHoaSender" onClick={() => {
                  dispatch({
                    type: DUNG_MA_CONGKHAI_DE_MA_HOA_TIN_NHAN,
                    publicKey: key.publicKey
                  })
                }}>Dùng để mã hóa tin nhắn</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
