import React, { Fragment, useEffect, useState } from "react";
import "./SecureCommunication_RSA.css";
import bigInt from "big-integer";
import Swal from "sweetalert2";
import { getAuth, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function SecureCommunicationRSA() {
  let loggined = useSelector(state => state.logginedReducer.loggined);
  const dispatch = useDispatch();
  const [publicKey, setPublicKey] = useState({ n: "", e: "" });
  const [keySize, setKeySize] = useState(512);
  const [privateKey, setPrivateKey] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [uploadedMessage, setUploadedMessage] = useState(""); // Đối tượng state để lưu trữ nội dung của tệp tin tin nhắn
  const [fileInputKey, setFileInputKey] = useState(0);
  const [typeTextInput, setTypeTextinput] = useState("");
  const [generateKey, setGenerateKeyStatus] = useState("");
  // Khai báo state cho giá trị của các input và textarea
  const [senderMessage, setSenderMessage] = useState("");
  const [receiverInput, setReceiverInput] = useState("");
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.onresize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Vui lòng chọn một tập tin.");
      return;
    }

    if (!file.type.match("text.*")) {
      alert("Chỉ chấp nhận tập tin có định dạng văn bản.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setUploadedMessage(content); // Cập nhật nội dung của tệp tin tin nhắn đã tải lên vào đối tượng state mới
    };
    reader.readAsText(file);

    Swal.fire({
      text: "Upload file thành công!",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const encryptUploadedMessage = () => {
    encryptMessage(uploadedMessage); // Gọi hàm mã hóa tin nhắn với nội dung của tệp tin đã tải lên
  };

  const generatePrime = (bits) => {
    const min = bigInt.one.shiftLeft(bits - 1);
    const max = bigInt.one.shiftLeft(bits).prev();
    let p;
    do {
      p = bigInt.randBetween(min, max);
    } while (!p.isProbablePrime());
    return p;
  };

  const generateKeyPair = () => {
    const p = generatePrime(keySize / 2);
    const q = generatePrime(keySize / 2);

    const n = p.multiply(q);

    const phi = p.prev().multiply(q.prev());

    let e, d;
    do {
      e = bigInt.randBetween(2, phi);
    } while (bigInt.gcd(e, phi).notEquals(1));

    d = e.modInv(phi);

    const newPublicKey = { n: n.toString(), e: e.toString() };
    const newPrivateKey = d.toString();

    setPublicKey(newPublicKey);
    setPrivateKey(newPrivateKey);
    setEncryptedMessage("");
    setDecryptedMessage("");
    setGenerateKeyStatus(true); // Khi click vào tạo khóa
  };

  const encryptMessage = (message) => {
    if (message === -1) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn nhập tin nhắn hoặc upload file để mã hóa!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!publicKey || !publicKey.n) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng tạo cặp khóa trước khi mã hóa tin nhắn.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (publicKey.n === "0") {
      Swal.fire({
        title: "Lỗi",
        text: "Modulus n không thể bằng 0. Vui lòng tạo lại cặp khóa.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (message.trim() === "") {
      Swal.fire({
        title: "Lỗi",
        text: "Tin nhắn không được để trống.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const charCodes = Array.from(message).map((char) => char.charCodeAt(0));

    const encryptedCharCodes = charCodes.map((charCode) =>
      bigInt(charCode).modPow(bigInt(publicKey.e), bigInt(publicKey.n))
    );

    const encryptedHex = encryptedCharCodes
      .map((charCode) => charCode.toString(16))
      .join(",");

    setEncryptedMessage(encryptedHex);
    Swal.fire({
      title: "Thành công",
      text: "Tin nhắn đã được mã hóa.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const decryptMessage = (encryptedMessage) => {
    if (!privateKey) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng tạo cặp khóa trước khi giải mã tin nhắn.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (encryptedMessage.trim() === "") {
      Swal.fire({
        title: "Lỗi",
        text: "Mã tin nhắn không được để trống.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const encryptedCharCodes = encryptedMessage
      .split(",")
      .map((hex) => bigInt(hex, 16));

    const decryptedCharCodes = encryptedCharCodes.map((charCode) =>
      charCode.modPow(privateKey, publicKey.n)
    );

    const decryptedMessage = decryptedCharCodes
      .map((charCode) => String.fromCharCode(Number(charCode)))
      .join("");

    setDecryptedMessage(decryptedMessage);
    Swal.fire({
      title: "Thành công",
      text: "Tin nhắn đã được giải mã.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const savePublicKeyToFile = () => {
    // Kiểm tra xem khóa công khai đã được tạo chưa
    if (!publicKey || !publicKey.n || publicKey.n === "0") {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng tạo cặp khóa trước khi lưu khóa công khai.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    //lưu khóa công khai
    const publicKeyText = `Public Key:\n${publicKey.n}\n${publicKey.e}`;
    const publicKeyBlob = new Blob([publicKeyText], { type: "text/plain" });
    const publicKeyUrl = URL.createObjectURL(publicKeyBlob);

    const publicKeyLink = document.createElement("a");
    publicKeyLink.href = publicKeyUrl;
    publicKeyLink.setAttribute("download", "public_key.txt");
    document.body.appendChild(publicKeyLink);
    publicKeyLink.click();

    // Clean up
    URL.revokeObjectURL(publicKeyUrl);
  };

  const savePrivateKeyToFile = () => {
    // Kiểm tra xem khóa bí mật đã được tạo chưa
    if (!privateKey) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng tạo cặp khóa trước khi lưu khóa bí mật.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    //lưu khóa bí mật
    const privateKeyText = `Private Key:\n${privateKey}`;
    const privateKeyBlob = new Blob([privateKeyText], { type: "text/plain" });
    const privateKeyUrl = URL.createObjectURL(privateKeyBlob);

    const privateKeyLink = document.createElement("a");
    privateKeyLink.href = privateKeyUrl;
    privateKeyLink.setAttribute("download", "private_key.txt");
    document.body.appendChild(privateKeyLink);
    privateKeyLink.click();

    // Clean up
    URL.revokeObjectURL(privateKeyUrl);
  };

  // Hàm reset
  const handleReset = () => {
    setSenderMessage("");
    setReceiverInput("");
    setEncryptedMessage("");
    setDecryptedMessage("");
    setUploadedMessage("");
    setFileInputKey((prevKey) => prevKey + 1);
  };

  let contentKey = [];
  if (generateKey === true) {
    contentKey = [];
    if (publicKey.n && publicKey.e) {
      contentKey.push(
        <div className="d-flex mb-2 mt-4">
          <p className="key_1">Khóa công khai:</p>
          <textarea
            className="form-control textArea_TaoKhoa"
            style={{ width: 300, height: 150 }}
            id="publicKey"
            readOnly
            value={publicKey.n}
          />
        </div>
      );
    }
    if (privateKey) {
      contentKey.push(
        <div className="d-flex">
          <p style={{ marginRight: "5%" }} className="key_1">
            Khóa bí mật:
          </p>
          <textarea
            className="form-control textArea_TaoKhoa"
            style={{ width: 300, height: 150 }}
            id="privateKey"
            readOnly
            value={privateKey}
          />
        </div>
      );
    }
  } else {
    contentKey = [];
    contentKey.push(
      <Fragment>
        <div className="d-flex mb-2 mt-4">
          <p className="key_1 hihi">Khóa công khai:</p>
          <textarea
            className="form-control textArea_TaoKhoa haha"
            style={{ width: 300, height: 150 }}
            id="publicKey"
            name="n"
          />
        </div>
        <div className="d-flex">
          <p style={{ marginRight: "5%" }} className="key_1">
            Khóa bí mật:
          </p>
          <textarea
            className="form-control textArea_TaoKhoa"
            style={{ width: 300, height: 150 }}
            id="privateKey"
          />
        </div>
      </Fragment>
    );
  }
  let marginBottomNhapTinNhanButton = "";
  if (typeTextInput) {
    marginBottomNhapTinNhanButton = "12px";
  } else if (!typeTextInput) {
    marginBottomNhapTinNhanButton = "43px";
  }

  let marginTopMaHoa_1 = "";
  if (typeTextInput) {
    marginTopMaHoa_1 = "10px";
  } else {
    marginTopMaHoa_1 = "20px";
  }
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch(err) {
      console.log(err)
    }
  }

  if (localStorage.getItem("loggined") == "true"){
    return (
      <div
        width={width}
        className="container-fluid"
        style={{ backgroundColor: "#E2DFD0", height: height }}
      >
        <div
          className="row firstRow p-3"
          style={{ backgroundColor: "#524C42", marginBottom: "2%" }}
        >
          <h3 className="account">Tài khoản: {JSON.parse(localStorage.getItem("email"))}</h3>
          <h1 className="text-center  h1_firstTitle" style={{ color: "#F97300" }}>
            Chương trình truyền tin mật sử dụng RSA
          </h1>
        </div>
        <div className="row secondRow">
          <div className="col-4">
            <div className="section">
              <h2>
                Tạo khóa <i style={{ color: "#F3CA52" }} class="fa fa-key"></i>
              </h2>
              <hr />
              <div>
                <span style={{ marginRight: 10 }}>Kích thước</span>
                <select
                  style={{ padding: 5 }}
                  id="keySize"
                  value={keySize}
                  onChange={(e) => setKeySize(parseInt(e.target.value))}
                >
                  <option value={512}>512</option>
                  <option value={1024}>1024</option>
                  <option value={2048}>2048</option>
                </select>
              </div>
  
              <br />
              <div>
                <button
                  style={{ marginTop: "30px" }}
                  className="btn btn-primary mb-2"
                  id="generateKeyPairButton"
                  onClick={generateKeyPair}
                >
                  Tạo khóa
                </button>
                <button className="btn btn-info">upload publicKey</button>
                <button className="btn btn-info">upload privateKey</button>
              </div>
  
              <button
                style={{ marginTop: 10 }}
                className="btn btn-info me-3 btn_saveKeyRes"
                onClick={savePublicKeyToFile}
              >
                Lưu khóa công khai
              </button>
              <button
                style={{ marginTop: 10, marginRight: 30 }}
                className="btn btn-info btn_saveKeyRes"
                onClick={savePrivateKeyToFile}
              >
                Lưu khóa bí mật
              </button>
              <div id="keyDisplay">
                {publicKey.n && publicKey.e && (
                  <div className="d-flex mb-2 mt-4 publicKeyDiv">
                    <p className="key_1">Khóa công khai:</p>
                    <textarea
                      className="form-control textArea_TaoKhoa"
                      style={{ width: 300, height: 150 }}
                      id="publicKey"
                      readOnly
                      value={`e: ${publicKey.e}\nn: ${publicKey.n}`}
                    />
                  </div>
                )}
                {privateKey && (
                  <div className="d-flex">
                    <p
                      style={{ marginRight: "6%", marginLeft: "1%" }}
                      className="key_1"
                    >
                      Khóa bí mật:
                    </p>
                    <textarea
                      className="form-control textArea_TaoKhoa khoa2"
                      style={{ width: 300, height: 150 }}
                      id="privateKey"
                      readOnly
                      value={`d: ${privateKey}\nn: ${publicKey.n}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="section">
              <h2>
                Người gửi <i class="fa fa-paper-plane text-primary"></i>
              </h2>
              <hr />
              <div>
                <div style={{ margin: "auto" }}>
                  {!uploadedMessage ? (
                    <button
                      style={{ marginBottom: `${marginBottomNhapTinNhanButton}` }}
                      className="btn btn-info me-3 mt-0"
                      onClick={() => {
                        setTypeTextinput(true);
                      }}
                    >
                      Nhập tin nhắn
                    </button>
                  ) : (
                    <button
                      className="btn btn-info me-3 mt-0"
                      disabled={true}
                      style={{
                        cursor: "no-drop",
                        marginBottom: `${marginBottomNhapTinNhanButton}`,
                      }}
                    >
                      Nhập tin nhắn
                    </button>
                  )}
  
                  <button
                    style={{ marginBottom: `${marginBottomNhapTinNhanButton}` }}
                    className="btn btn-info mt-0"
                    onClick={() => {
                      document.getElementById("fileInput").click();
                      setTypeTextinput(false);
                    }}
                  >
                    Upload file txt
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".txt"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </div>
                {typeTextInput ? (
                  <div className="d-flex align-items-center">
                    <span className="me-3">Đầu vào</span>
                    <input
                      id="senderMessage"
                      placeholder="Nhập tin nhắn"
                      className="form-control"
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              {!uploadedMessage ? (
                <button
                  style={{ marginTop: `${marginTopMaHoa_1}` }}
                  className="btn btn-primary"
                  onClick={() => {
                    if (typeTextInput) {
                      encryptMessage(
                        document.getElementById("senderMessage").value
                      );
                    } else {
                      encryptMessage(-1);
                    }
                  }}
                >
                  Mã hóa tin nhắn
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={encryptUploadedMessage} // Khi người dùng nhấp vào nút "Mã hóa", gọi hàm để mã hóa tin nhắn từ tệp tin đã tải lên
                >
                  Mã hóa file
                </button>
              )}
              <p className="mb-0">Kết quả sau khi mã hóa:</p>
              <textarea
                className="form-control textarea_SR fdakfjda"
                style={{ width: 300, height: 300, margin: "auto" }}
                id="encryptedMessage"
                readOnly
                value={encryptedMessage}
              />
            </div>
          </div>
  
          <div className="col-4">
            <div className="section">
              <h2>
                Người nhận <i class="fa-solid fa-person text-primary"></i>
              </h2>
              <hr />
              <div className="d-flex align-items-center">
                <span>Đầu vào</span>
                <input
                  id="receiverInput"
                  placeholder="Nhập mã"
                  className="form-control"
                  value={encryptedMessage}
                />
              </div>
              <button
                className="btn btn-primary btn_KiemTra"
                onClick={() =>
                  decryptMessage(document.getElementById("receiverInput").value)
                }
                style={{ marginTop: "55px" }}
              >
                Kiểm tra
              </button>
              <p className="mb-0">Kết quả sau khi giải mã:</p>
              <textarea
                className="form-control textarea_SR"
                style={{ width: 300, height: 300, margin: "auto" }}
                id="decryptedMessage"
                readOnly
                value={decryptedMessage}
              />
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          {encryptedMessage && (
            <button className="btn btn-info" onClick={handleReset}>
              Reset
            </button>
          )}
            {loggined && <button className="btn btn-info" onClick={() => {
              localStorage.setItem("loggined", "false");
              dispatch({
                type: "LOGGINED_FAILED",
                loggined: false,
              })
              handleSignOut();
            }}>
              Sign Out
            </button>}
        </div>
      </div>
    );
  } else {
    alert("Vui lòng đăng nhập để có thể dùng ứng dụng");
    return <Navigate to={"/login"}/>
  }
}
